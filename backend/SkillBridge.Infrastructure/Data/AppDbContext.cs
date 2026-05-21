using Microsoft.EntityFrameworkCore;
using SkillBridge.Core.Entities;

namespace SkillBridge.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<Challenge> Challenges => Set<Challenge>();
    public DbSet<ChallengeAttempt> ChallengeAttempts => Set<ChallengeAttempt>();
    public DbSet<Credential> Credentials => Set<Credential>();
    public DbSet<JobPosting> JobPostings => Set<JobPosting>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // Unique indexes
        mb.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        mb.Entity<Skill>()
            .HasIndex(s => s.Slug)
            .IsUnique();

        mb.Entity<Credential>()
            .HasIndex(c => c.PublicToken)
            .IsUnique();

        // Store job required skills as JSONB in PostgreSQL
        mb.Entity<JobPosting>()
            .Property(j => j.RequiredSkillsJson)
            .HasColumnType("jsonb");

        // Relationships with cascade delete
        mb.Entity<ChallengeAttempt>()
            .HasOne(a => a.User)
            .WithMany(u => u.Attempts)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<ChallengeAttempt>()
            .HasOne(a => a.Challenge)
            .WithMany(c => c.Attempts)
            .HasForeignKey(a => a.ChallengeId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<Credential>()
            .HasOne(c => c.User)
            .WithMany(u => u.Credentials)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<Credential>()
            .HasOne(c => c.Skill)
            .WithMany(s => s.Credentials)
            .HasForeignKey(c => c.SkillId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<RefreshToken>()
            .HasOne(r => r.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<Challenge>()
            .HasOne(c => c.Skill)
            .WithMany(s => s.Challenges)
            .HasForeignKey(c => c.SkillId)
            .OnDelete(DeleteBehavior.Cascade);

        // Store enums as readable strings not integers
        mb.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>();

        mb.Entity<Challenge>()
            .Property(c => c.Difficulty)
            .HasConversion<string>();

        mb.Entity<ChallengeAttempt>()
            .Property(a => a.Status)
            .HasConversion<string>();
    }
}