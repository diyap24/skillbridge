using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBridge.API.Extensions;
using SkillBridge.Core.DTOs;
using SkillBridge.Core.Interfaces;

namespace SkillBridge.API.Controllers;

[ApiController]
[Route("api/challenges")]
public class ChallengesController(IChallengeService challengeService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] string? skill,
        [FromQuery] string? difficulty,
        [FromQuery] int page     = 1,
        [FromQuery] int pageSize = 12)
    {
        var items = await challengeService.ListAsync(skill, difficulty, page, pageSize);
        return Ok(new { data = items, page, pageSize });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var challenge = await challengeService.GetByIdAsync(id);
        return challenge == null ? NotFound() : Ok(challenge);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateChallengeDto dto)
    {
        var challenge = await challengeService.CreateAsync(dto, User.GetUserId());
        return CreatedAtAction(nameof(Get), new { id = challenge.Id }, challenge);
    }

    [HttpPost("{id:guid}/submit")]
    [Authorize]
    public async Task<IActionResult> Submit(Guid id, [FromBody] SubmitCodeDto dto)
    {
        try
        {
            var result = await challengeService.SubmitAsync(id, User.GetUserId(), dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
