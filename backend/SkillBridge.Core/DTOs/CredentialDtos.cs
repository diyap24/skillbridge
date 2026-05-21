namespace SkillBridge.Core.DTOs;

public record CredentialDto(
    Guid Id,
    string CandidateName,
    string SkillName,
    string SkillCategory,
    string PublicToken,
    int ScorePercentile,
    DateTime IssuedAt,
    DateTime? ExpiresAt,
    bool IsRevoked
);