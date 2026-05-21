namespace SkillBridge.Core.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Candidate;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ChallengeAttempt> Attempts { get; set; } = [];
    public ICollection<Credential> Credentials { get; set; } = [];
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}

public enum UserRole { Candidate, Employer, Admin }