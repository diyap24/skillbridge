using Microsoft.EntityFrameworkCore;
using SkillBridge.Core.DTOs;
using SkillBridge.Core.Entities;
using SkillBridge.Core.Interfaces;
using SkillBridge.Infrastructure.Data;

namespace SkillBridge.Infrastructure.Services;

public class CredentialService(AppDbContext db) : ICredentialService
{
    public async Task<CredentialDto> IssueAsync(
        Guid userId, Guid skillId, int scorePercentile)
    {
        var credential = new Credential
        {
            UserId           = userId,
            SkillId          = skillId,
            ScorePercentile  = scorePercentile,
            ExpiresAt        = DateTime.UtcNow.AddYears(2),
        };

        db.Credentials.Add(credential);
        await db.SaveChangesAsync();

        // Load navigation properties
        await db.Entry(credential).Reference(c => c.User).LoadAsync();
        await db.Entry(credential).Reference(c => c.Skill).LoadAsync();

        return ToDto(credential);
    }

    public async Task<CredentialDto?> VerifyAsync(string publicToken)
    {
        var credential = await db.Credentials
            .Include(c => c.User)
            .Include(c => c.Skill)
            .FirstOrDefaultAsync(c =>
                c.PublicToken == publicToken && !c.IsRevoked);

        return credential == null ? null : ToDto(credential);
    }

    public async Task<List<CredentialDto>> GetByUserAsync(Guid userId)
    {
        return await db.Credentials
            .Include(c => c.User)
            .Include(c => c.Skill)
            .Where(c => c.UserId == userId && !c.IsRevoked)
            .OrderByDescending(c => c.IssuedAt)
            .Select(c => ToDto(c))
            .ToListAsync();
    }

    // ── Private helper ────────────────────────────────────────────────────────
    private static CredentialDto ToDto(Credential c) => new(
        c.Id,
        c.User.FullName,
        c.Skill.Name,
        c.Skill.Category,
        c.PublicToken,
        c.ScorePercentile,
        c.IssuedAt,
        c.ExpiresAt,
        c.IsRevoked
    );
}