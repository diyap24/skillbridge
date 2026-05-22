using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SkillBridge.Core.DTOs;
using SkillBridge.Infrastructure.Data;
using SkillBridge.Infrastructure.Services;

namespace SkillBridge.Tests.Services;

public class AuthServiceTests
{
    private static AppDbContext GetDb()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(opts);
    }

    private static AuthService GetService(AppDbContext db)
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Secret"]                   = "test-secret-key-minimum-32-characters-long!",
                ["Jwt:Issuer"]                   = "test-issuer",
                ["Jwt:Audience"]                 = "test-audience",
                ["Jwt:AccessTokenExpiryMinutes"] = "15",
                ["Jwt:RefreshTokenExpiryDays"]   = "7",
            })
            .Build();

        var tokenService = new TokenService(config);
        return new AuthService(db, tokenService, config);
    }

    [Fact]
    public async Task RegisterAsync_WithNewEmail_ReturnsTokens()
    {
        var db     = GetDb();
        var svc    = GetService(db);
        var result = await svc.RegisterAsync(
            new RegisterDto("Jane Smith", "jane@test.com", "Password@123", "Candidate"));

        Assert.NotNull(result);
        result.AccessToken.Should().NotBeEmpty();
        result.RefreshToken.Should().NotBeEmpty();
        result.User.Email.Should().Be("jane@test.com");
        result.User.Role.Should().Be("Candidate");
    }

    [Fact]
    public async Task RegisterAsync_WithDuplicateEmail_ReturnsNull()
    {
        var db  = GetDb();
        var svc = GetService(db);

        await svc.RegisterAsync(
            new RegisterDto("Jane", "jane@test.com", "Password@123"));

        var duplicate = await svc.RegisterAsync(
            new RegisterDto("Jane Again", "jane@test.com", "Password@123"));

        Assert.Null(duplicate);
    }

    [Fact]
    public async Task LoginAsync_WithCorrectCredentials_ReturnsTokens()
    {
        var db  = GetDb();
        var svc = GetService(db);

        await svc.RegisterAsync(
            new RegisterDto("Jane Smith", "jane@test.com", "Password@123"));

        var result = await svc.LoginAsync(
            new LoginDto("jane@test.com", "Password@123"));

        Assert.NotNull(result);
        result.AccessToken.Should().NotBeEmpty();
    }

    [Fact]
    public async Task LoginAsync_WithWrongPassword_ReturnsNull()
    {
        var db  = GetDb();
        var svc = GetService(db);

        await svc.RegisterAsync(
            new RegisterDto("Jane Smith", "jane@test.com", "Password@123"));

        var result = await svc.LoginAsync(
            new LoginDto("jane@test.com", "WrongPassword"));

        Assert.Null(result);
    }
}
