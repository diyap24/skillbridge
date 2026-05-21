namespace SkillBridge.Core.Entities;

public class Credential
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid SkillId { get; set; }
    public Skill Skill { get; set; } = null!;

    public string PublicToken { get; set; } = Guid.NewGuid().ToString("N");
    public int ScorePercentile { get; set; }
    public bool IsRevoked { get; set; } = false;
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
}