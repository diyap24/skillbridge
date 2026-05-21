namespace SkillBridge.Core.Entities;

public class Challenge
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SkillId { get; set; }
    public Skill Skill { get; set; } = null!;
    public Guid CreatedByUserId { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string StarterCode { get; set; } = string.Empty;
    public string TestCasesJson { get; set; } = "[]";
    public Difficulty Difficulty { get; set; } = Difficulty.Beginner;
    public int TimeLimitSeconds { get; set; } = 300;
    public int PassScore { get; set; } = 70;
    public bool IsPublished { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ChallengeAttempt> Attempts { get; set; } = [];
}

public enum Difficulty { Beginner, Intermediate, Advanced, Expert }