using Microsoft.EntityFrameworkCore;
using SkillBridge.Core.Entities;

namespace SkillBridge.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.MigrateAsync();

        if (await db.Skills.AnyAsync()) return;

        var skills = new List<Skill>
        {
            new() { Name = "React",      Slug = "react",      Category = "Frontend",  Description = "React JS development" },
            new() { Name = "C#",         Slug = "csharp",     Category = "Backend",   Description = "C# and .NET development" },
            new() { Name = "Python",     Slug = "python",     Category = "Backend",   Description = "Python programming" },
            new() { Name = "SQL",        Slug = "sql",        Category = "Database",  Description = "SQL querying and design" },
            new() { Name = "TypeScript", Slug = "typescript", Category = "Frontend",  Description = "TypeScript development" },
            new() { Name = "Docker",     Slug = "docker",     Category = "DevOps",    Description = "Docker containerisation" },
        };
        db.Skills.AddRange(skills);

        var admin = new User
        {
            Email        = "admin@skillbridge.dev",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            FullName     = "SkillBridge Admin",
            Role         = UserRole.Admin,
        };
        db.Users.Add(admin);
        await db.SaveChangesAsync();

        var python = skills.First(s => s.Slug == "python");
        var react  = skills.First(s => s.Slug == "react");
        var csharp = skills.First(s => s.Slug == "csharp");

        db.Challenges.AddRange(
            new Challenge
            {
                SkillId          = python.Id,
                CreatedByUserId  = admin.Id,
                Title            = "Reverse a String",
                Description      = "Write reverse_string(s) that returns the reversed string.",
                StarterCode      = "def reverse_string(s: str) -> str:\n    pass",
                TestCasesJson    = "[{\"input\":\"hello\",\"expected\":\"olleh\"}]",
                Difficulty       = Difficulty.Beginner,
                TimeLimitSeconds = 300,
                PassScore        = 80,
                IsPublished      = true,
            },
            new Challenge
            {
                SkillId          = react.Id,
                CreatedByUserId  = admin.Id,
                Title            = "Build a Counter Component",
                Description      = "Create a React counter with increment, decrement, and reset. Count never goes below 0.",
                StarterCode      = "function Counter() {\n  return <div>Count: 0</div>;\n}",
                TestCasesJson    = "[]",
                Difficulty       = Difficulty.Beginner,
                TimeLimitSeconds = 600,
                PassScore        = 70,
                IsPublished      = true,
            },
            new Challenge
            {
                SkillId          = csharp.Id,
                CreatedByUserId  = admin.Id,
                Title            = "FizzBuzz",
                Description      = "Return Fizz, Buzz, FizzBuzz, or the number as string.",
                StarterCode      = "public string FizzBuzz(int n) {\n    return \"\";\n}",
                TestCasesJson    = "[{\"input\":\"3\",\"expected\":\"Fizz\"},{\"input\":\"5\",\"expected\":\"Buzz\"}]",
                Difficulty       = Difficulty.Beginner,
                TimeLimitSeconds = 300,
                PassScore        = 80,
                IsPublished      = true,
            }
        );

        await db.SaveChangesAsync();

        Console.WriteLine("========================================");
        Console.WriteLine("  Database seeded successfully!");
        Console.WriteLine("  Login: admin@skillbridge.dev");
        Console.WriteLine("  Pass:  Admin@123");
        Console.WriteLine("========================================");
    }
}
