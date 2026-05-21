namespace SkillBridge.Core.DTOs;

public record RegisterDto(
    string FullName,
    string Email,
    string Password,
    string Role = "Candidate"
);

public record LoginDto(
    string Email,
    string Password
);

public record RefreshDto(
    string RefreshToken
);

public record AuthResponseDto(
    string AccessToken,
    string RefreshToken,
    UserDto User
);

public record UserDto(
    Guid Id,
    string FullName,
    string Email,
    string Role
);