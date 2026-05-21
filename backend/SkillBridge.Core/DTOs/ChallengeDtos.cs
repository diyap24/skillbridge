namespace SkillBridge.Core.DTOs;

public record ChallengeListItemDto(
    Guid Id,
    string Title,
    string SkillName,
    string SkillSlug,
    string Difficulty,
    int TimeLimitSeconds,
    int PassScore,
    int AttemptCount
);

public record ChallengeDetailDto(
    Guid Id,
    string Title,
    string Description,
    string StarterCode,
    Guid SkillId,
    string SkillName,
    string Difficulty,
    int TimeLimitSeconds,
    int PassScore
);

public record CreateChallengeDto(
    Guid SkillId,
    string Title,
    string Description,
    string StarterCode,
    string TestCasesJson,
    string Difficulty,
    int TimeLimitSeconds,
    int PassScore
);

public record SubmitCodeDto(
    string Code,
    string Language
);

public record SubmissionResultDto(
    string Status,
    int Score,
    int RuntimeMs,
    int MemoryKb,
    List<TestCaseResultDto> TestCases,
    bool CredentialIssued,
    Guid? CredentialId
);

public record TestCaseResultDto(
    string Input,
    string Expected,
    string Actual,
    bool Passed
);