using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using SkillBridge.API.Extensions;
using SkillBridge.Core.DTOs;
using SkillBridge.Core.Entities;
using SkillBridge.Infrastructure.Data;

namespace SkillBridge.API.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? skill)
    {
        var jobs = await db.JobPostings
            .Where(j => j.IsActive)
            .OrderByDescending(j => j.PostedAt)
            .ToListAsync();

        var result = jobs
            .Select(j => new JobPostingDto(
                j.Id,
                j.Title,
                j.Company,
                j.Location,
                j.Description,
                JsonSerializer.Deserialize<List<string>>(j.RequiredSkillsJson)
                    ?? new List<string>(),
                j.PostedAt))
            .ToList();

        // Filter by skill if provided
        if (!string.IsNullOrWhiteSpace(skill))
            result = result
                .Where(j => j.RequiredSkills
                    .Any(s => s.Equals(skill, StringComparison.OrdinalIgnoreCase)))
                .ToList();

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var job = await db.JobPostings
            .FirstOrDefaultAsync(j => j.Id == id && j.IsActive);

        if (job == null) return NotFound();

        return Ok(new JobPostingDto(
            job.Id,
            job.Title,
            job.Company,
            job.Location,
            job.Description,
            JsonSerializer.Deserialize<List<string>>(job.RequiredSkillsJson)
                ?? new List<string>(),
            job.PostedAt));
    }

    [HttpPost]
    [Authorize(Roles = "Employer,Admin")]
    public async Task<IActionResult> Create([FromBody] CreateJobDto dto)
    {
        var job = new JobPosting
        {
            EmployerId        = User.GetUserId(),
            Title             = dto.Title,
            Company           = dto.Company,
            Location          = dto.Location,
            Description       = dto.Description,
            RequiredSkillsJson = JsonSerializer.Serialize(dto.RequiredSkills),
        };

        db.JobPostings.Add(job);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = job.Id },
            new JobPostingDto(
                job.Id, job.Title, job.Company, job.Location,
                job.Description, dto.RequiredSkills, job.PostedAt));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Employer,Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var job = await db.JobPostings
            .FirstOrDefaultAsync(j => j.Id == id &&
                                      j.EmployerId == User.GetUserId());

        if (job == null) return NotFound();

        job.IsActive = false;
        await db.SaveChangesAsync();
        return NoContent();
    }
}
