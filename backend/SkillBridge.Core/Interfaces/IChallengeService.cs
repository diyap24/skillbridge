using SkillBridge.Core.DTOs;

namespace SkillBridge.Core.Interfaces;

public interface IChallengeService
{
    Task<List<ChallengeListItemDto>> ListAsync(
        string? skill, string? difficulty, int page, int pageSize);
    Task<ChallengeDetailDto?> GetByIdAsync(Guid id);
    Task<ChallengeDetailDto> CreateAsync(CreateChallengeDto dto, Guid createdBy);
    Task<SubmissionResultDto> SubmitAsync(Guid challengeId, Guid userId, SubmitCodeDto dto);
}