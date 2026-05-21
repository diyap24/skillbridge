namespace SkillBridge.Core.DTOs;

public record JobPostingDto(
    Guid Id,
    string Title,
    string Company,
    string Location,
    string Description,
    List<string> RequiredSkills,
    DateTime PostedAt
);

public record CreateJobDto(
    string Title,
    string Company,
    string Location,
    string Description,
    List<string> RequiredSkills
);