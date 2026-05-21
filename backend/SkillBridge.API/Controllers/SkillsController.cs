using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillBridge.Core.DTOs;
using SkillBridge.Core.Entities;
using SkillBridge.Infrastructure.Data;

namespace SkillBridge.API.Controllers;

[ApiController]
[Route("api/skills")]
public class SkillsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? category)
    {
        var query = db.Skills.Where(s => s.IsActive);

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(s => s.Category == category);

        var skills = await query
            .OrderBy(s => s.Category)
            .ThenBy(s => s.Name)
            .Select(s => new SkillDto(
                s.Id, s.Name, s.Slug, s.Category, s.Description))
            .ToListAsync();

        return Ok(skills);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> Get(string slug)
    {
        var skill = await db.Skills
            .Where(s => s.Slug == slug && s.IsActive)
            .Select(s => new SkillDto(
                s.Id, s.Name, s.Slug, s.Category, s.Description))
            .FirstOrDefaultAsync();

        return skill == null ? NotFound() : Ok(skill);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateSkillDto dto)
    {
        if (await db.Skills.AnyAsync(s => s.Slug == dto.Slug))
            return Conflict(new { message = "Slug already exists" });

        var skill = new Skill
        {
            Name        = dto.Name,
            Slug        = dto.Slug.ToLower().Trim(),
            Category    = dto.Category,
            Description = dto.Description,
        };

        db.Skills.Add(skill);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get),
            new { slug = skill.Slug },
            new SkillDto(skill.Id, skill.Name, skill.Slug,
                         skill.Category, skill.Description));
    }
}
