using SkillBridge.Core.DTOs;

namespace SkillBridge.Core.Interfaces;

public interface ICredentialService
{
    Task<CredentialDto> IssueAsync(Guid userId, Guid skillId, int scorePercentile);
    Task<CredentialDto?> VerifyAsync(string publicToken);
    Task<List<CredentialDto>> GetByUserAsync(Guid userId);
}