namespace SkillBridge.Core.DTOs;

public record SkillDto(
    Guid Id,
    string Name,
    string Slug,
    string Category,
    string Description
);

public record CreateSkillDto(
    string Name,
    string Slug,
    string Category,
    string Description
);