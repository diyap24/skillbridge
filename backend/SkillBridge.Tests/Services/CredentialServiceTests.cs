using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SkillBridge.Core.Entities;
using SkillBridge.Infrastructure.Data;
using SkillBridge.Infrastructure.Services;

namespace SkillBridge.Tests.Services;

public class CredentialServiceTests
{
    private static AppDbContext GetDb()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(opts);
    }

    [Fact]
    public async Task IssueAsync_CreatesCredential_WithCorrectFields()
    {
        var db   = GetDb();
        var user = new User
        {
            Email        = "test@sb.dev",
            FullName     = "Test User",
            PasswordHash = "x",
            Role         = UserRole.Candidate,
        };
        var skill = new Skill
        {
            Name        = "React",
            Slug        = "react",
            Category    = "Frontend",
            Description = "React JS",
        };
        db.Users.Add(user);
        db.Skills.Add(skill);
        await db.SaveChangesAsync();

        var svc    = new CredentialService(db);
        var result = await svc.IssueAsync(user.Id, skill.Id, 85);

        Assert.NotNull(result);
        result.CandidateName.Should().Be("Test User");
        result.SkillName.Should().Be("React");
        result.ScorePercentile.Should().Be(85);
        result.IsRevoked.Should().BeFalse();
        result.PublicToken.Should().NotBeEmpty();
    }

    [Fact]
    public async Task VerifyAsync_WithInvalidToken_ReturnsNull()
    {
        var db  = GetDb();
        var svc = new CredentialService(db);

        var result = await svc.VerifyAsync("invalid-token-xyz");

        Assert.Null(result);
    }

    [Fact]
    public async Task GetByUserAsync_ReturnsOnlyUserCredentials()
    {
        var db    = GetDb();
        var user1 = new User { Email = "a@test.com", FullName = "User A", PasswordHash = "x" };
        var user2 = new User { Email = "b@test.com", FullName = "User B", PasswordHash = "x" };
        var skill = new Skill
        {
            Name        = "Python",
            Slug        = "python",
            Category    = "Backend",
            Description = "Python",
        };

        db.Users.AddRange(user1, user2);
        db.Skills.Add(skill);
        await db.SaveChangesAsync();

        var svc = new CredentialService(db);
        await svc.IssueAsync(user1.Id, skill.Id, 90);
        await svc.IssueAsync(user2.Id, skill.Id, 75);

        var results = await svc.GetByUserAsync(user1.Id);

        results.Should().HaveCount(1);
        results[0].CandidateName.Should().Be("User A");
    }
}
