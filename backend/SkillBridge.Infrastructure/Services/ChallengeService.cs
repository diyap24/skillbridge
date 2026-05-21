using Microsoft.EntityFrameworkCore;
using SkillBridge.Core.DTOs;
using SkillBridge.Core.Entities;
using SkillBridge.Core.Interfaces;
using SkillBridge.Core.Models;
using SkillBridge.Infrastructure.Data;

namespace SkillBridge.Infrastructure.Services;

public class ChallengeService(
    AppDbContext db,
    ISubmissionRepository submissions,
    ICredentialService credentials) : IChallengeService
{
    public async Task<List<ChallengeListItemDto>> ListAsync(
        string? skill, string? difficulty, int page, int pageSize)
    {
        var query = db.Challenges
            .Include(c => c.Skill)
            .Where(c => c.IsPublished);

        if (!string.IsNullOrWhiteSpace(skill))
            query = query.Where(c => c.Skill.Slug == skill);

        if (!string.IsNullOrWhiteSpace(difficulty) &&
            Enum.TryParse<Difficulty>(difficulty, true, out var diff))
            query = query.Where(c => c.Difficulty == diff);

        return await query
            .OrderBy(c => c.Difficulty)
            .ThenBy(c => c.Title)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new ChallengeListItemDto(
                c.Id,
                c.Title,
                c.Skill.Name,
                c.Skill.Slug,
                c.Difficulty.ToString(),
                c.TimeLimitSeconds,
                c.PassScore,
                c.Attempts.Count))
            .ToListAsync();
    }

    public async Task<ChallengeDetailDto?> GetByIdAsync(Guid id)
    {
        return await db.Challenges
            .Include(c => c.Skill)
            .Where(c => c.Id == id && c.IsPublished)
            .Select(c => new ChallengeDetailDto(
                c.Id,
                c.Title,
                c.Description,
                c.StarterCode,
                c.SkillId,
                c.Skill.Name,
                c.Difficulty.ToString(),
                c.TimeLimitSeconds,
                c.PassScore))
            .FirstOrDefaultAsync();
    }

    public async Task<ChallengeDetailDto> CreateAsync(
        CreateChallengeDto dto, Guid createdBy)
    {
        if (!Enum.TryParse<Difficulty>(dto.Difficulty, true, out var diff))
            diff = Difficulty.Beginner;

        var challenge = new Challenge
        {
            SkillId          = dto.SkillId,
            CreatedByUserId  = createdBy,
            Title            = dto.Title,
            Description      = dto.Description,
            StarterCode      = dto.StarterCode,
            TestCasesJson    = dto.TestCasesJson,
            Difficulty       = diff,
            TimeLimitSeconds = dto.TimeLimitSeconds,
            PassScore        = dto.PassScore,
        };

        db.Challenges.Add(challenge);
        await db.SaveChangesAsync();
        await db.Entry(challenge).Reference(c => c.Skill).LoadAsync();

        return new ChallengeDetailDto(
            challenge.Id,
            challenge.Title,
            challenge.Description,
            challenge.StarterCode,
            challenge.SkillId,
            challenge.Skill.Name,
            challenge.Difficulty.ToString(),
            challenge.TimeLimitSeconds,
            challenge.PassScore);
    }

    public async Task<SubmissionResultDto> SubmitAsync(
        Guid challengeId, Guid userId, SubmitCodeDto dto)
    {
        var challenge = await db.Challenges
            .Include(c => c.Skill)
            .FirstOrDefaultAsync(c => c.Id == challengeId && c.IsPublished)
            ?? throw new KeyNotFoundException("Challenge not found");

        var attempt = new ChallengeAttempt
        {
            UserId      = userId,
            ChallengeId = challengeId,
            Status      = AttemptStatus.Running,
        };
        db.ChallengeAttempts.Add(attempt);
        await db.SaveChangesAsync();

        var execResult = SimulateExecution(dto.Code, dto.Language);

        var score = execResult.TestCases.Count == 0
            ? 75
            : (int)(execResult.TestCases.Count(t => t.Passed) * 100.0
              / execResult.TestCases.Count);

        var submission = new CodeSubmission
        {
            AttemptId   = attempt.Id,
            UserId      = userId,
            ChallengeId = challengeId,
            Language    = dto.Language,
            SourceCode  = dto.Code,
            Result      = execResult,
        };
        var mongoId = await submissions.SaveAsync(submission);

        attempt.Score             = score;
        attempt.Status            = score >= challenge.PassScore
                                      ? AttemptStatus.Passed
                                      : AttemptStatus.Failed;
        attempt.MongoSubmissionId = mongoId;
        await db.SaveChangesAsync();

        Guid? credentialId = null;
        var alreadyHas = await db.Credentials.AnyAsync(
            c => c.UserId == userId &&
                 c.SkillId == challenge.SkillId &&
                 !c.IsRevoked);

        if (attempt.Status == AttemptStatus.Passed && !alreadyHas)
        {
            var percentile = Math.Min(100, score + 10);
            var cred = await credentials.IssueAsync(userId, challenge.SkillId, percentile);
            credentialId = cred.Id;
        }

        return new SubmissionResultDto(
            attempt.Status.ToString(),
            score,
            execResult.RuntimeMs,
            execResult.MemoryKb,
            execResult.TestCases
                .Select(t => new TestCaseResultDto(
                    t.Input, t.Expected, t.Actual, t.Passed))
                .ToList(),
            credentialId.HasValue,
            credentialId);
    }

    private static ExecutionResult SimulateExecution(string code, string language)
    {
        return new ExecutionResult
        {
            Status    = "passed",
            RuntimeMs = Random.Shared.Next(80, 450),
            MemoryKb  = Random.Shared.Next(8000, 32000),
            TestCases =
            [
                new() { Input = "hello", Expected = "olleh", Actual = "olleh", Passed = true },
                new() { Input = "world", Expected = "dlrow", Actual = "dlrow", Passed = true },
            ]
        };
    }
}
