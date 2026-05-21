namespace SkillBridge.Core.Entities;

public class JobPosting
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EmployerId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RequiredSkillsJson { get; set; } = "[]";
    public bool IsActive { get; set; } = true;
    public DateTime PostedAt { get; set; } = DateTime.UtcNow;
}