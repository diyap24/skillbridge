using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SkillBridge.Core.DTOs;
using SkillBridge.Core.Entities;
using SkillBridge.Core.Interfaces;
using SkillBridge.Infrastructure.Data;

namespace SkillBridge.Infrastructure.Services;

public class AuthService(
    AppDbContext db,
    TokenService tokenService,
    IConfiguration config) : IAuthService
{
    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
    {
        // Check email not already taken
        if (await db.Users.AnyAsync(u => u.Email == dto.Email.ToLower().Trim()))
            return null;

        if (!Enum.TryParse<UserRole>(dto.Role, ignoreCase: true, out var role))
            role = UserRole.Candidate;

        var user = new User
        {
            Email        = dto.Email.ToLower().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FullName     = dto.FullName.Trim(),
            Role         = role,
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return await BuildResponseAsync(user);
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await db.Users.FirstOrDefaultAsync(
            u => u.Email == dto.Email.ToLower().Trim() && u.IsActive);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        return await BuildResponseAsync(user);
    }

    public async Task<AuthResponseDto?> RefreshAsync(string refreshToken)
    {
        var stored = await db.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r =>
                r.Token == refreshToken &&
                !r.IsRevoked &&
                r.ExpiresAt > DateTime.UtcNow);

        if (stored == null) return null;

        // Rotate — revoke old token, issue new one
        stored.IsRevoked = true;
        await db.SaveChangesAsync();

        return await BuildResponseAsync(stored.User);
    }

    public async Task RevokeAsync(Guid userId)
    {
        var tokens = await db.RefreshTokens
            .Where(r => r.UserId == userId && !r.IsRevoked)
            .ToListAsync();

        foreach (var t in tokens)
            t.IsRevoked = true;

        await db.SaveChangesAsync();
    }

    // ── Private helper ────────────────────────────────────────────────────────
    private async Task<AuthResponseDto> BuildResponseAsync(User user)
    {
        var accessToken  = tokenService.GenerateAccessToken(user);
        var refreshToken = tokenService.GenerateRefreshToken();

        var expiryDays = int.Parse(config["Jwt:RefreshTokenExpiryDays"]!);

        db.RefreshTokens.Add(new RefreshToken
        {
            UserId    = user.Id,
            Token     = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays),
        });
        await db.SaveChangesAsync();

        return new AuthResponseDto(
            accessToken,
            refreshToken,
            new UserDto(user.Id, user.FullName, user.Email, user.Role.ToString())
        );
    }
}