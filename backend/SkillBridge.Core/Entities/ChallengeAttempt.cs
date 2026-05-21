namespace SkillBridge.Core.Entities;

public class ChallengeAttempt
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid ChallengeId { get; set; }
    public Challenge Challenge { get; set; } = null!;

    public int Score { get; set; }
    public AttemptStatus Status { get; set; } = AttemptStatus.Pending;
    public string? MongoSubmissionId { get; set; }
    public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;
}

public enum AttemptStatus { Pending, Running, Passed, Failed, TimedOut, Error }