using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBridge.API.Extensions;
using SkillBridge.Core.Interfaces;

namespace SkillBridge.API.Controllers;

[ApiController]
[Route("api/credentials")]
public class CredentialsController(ICredentialService credentialService) : ControllerBase
{
    [HttpGet("mine")]
    [Authorize]
    public async Task<IActionResult> Mine()
    {
        var creds = await credentialService.GetByUserAsync(User.GetUserId());
        return Ok(creds);
    }

    [HttpGet("verify/{token}")]
    [AllowAnonymous]
    public async Task<IActionResult> Verify(string token)
    {
        var cred = await credentialService.VerifyAsync(token);
        return cred == null
            ? NotFound(new { message = "Credential not found or revoked" })
            : Ok(cred);
    }
}
