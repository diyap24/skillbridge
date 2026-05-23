using Microsoft.EntityFrameworkCore;
using SkillBridge.Core.Entities;

namespace SkillBridge.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.MigrateAsync();

        if (await db.Skills.AnyAsync()) return;

        // ── Skills ────────────────────────────────────────────────────────────
        var skills = new List<Skill>
        {
            new() { Name = "React",       Slug = "react",      Category = "Frontend",  Description = "React JS development" },
            new() { Name = "C#",          Slug = "csharp",     Category = "Backend",   Description = "C# and .NET development" },
            new() { Name = "Python",      Slug = "python",     Category = "Backend",   Description = "Python programming" },
            new() { Name = "SQL",         Slug = "sql",        Category = "Database",  Description = "SQL querying and design" },
            new() { Name = "TypeScript",  Slug = "typescript", Category = "Frontend",  Description = "TypeScript development" },
            new() { Name = "Docker",      Slug = "docker",     Category = "DevOps",    Description = "Docker containerisation" },
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
        var sql    = skills.First(s => s.Slug == "sql");
        var ts     = skills.First(s => s.Slug == "typescript");

        var challenges = new List<Challenge>
        {
            // ── Python Beginner ───────────────────────────────────────────────
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "Reverse a String",
                Description = "Write a function reverse_string(s) that returns the reversed version of the input string.\n\nExamples:\n  reverse_string('hello') → 'olleh'\n  reverse_string('world') → 'dlrow'",
                StarterCode = "def reverse_string(s: str) -> str:\n    # Your code here\n    pass",
                TestCasesJson = "[{\"input\":\"hello\",\"expected\":\"olleh\"},{\"input\":\"world\",\"expected\":\"dlrow\"}]",
                Difficulty = Difficulty.Beginner, TimeLimitSeconds = 300, PassScore = 80, IsPublished = true,
            },
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "Count Vowels",
                Description = "Write a function count_vowels(s) that counts the number of vowels (a, e, i, o, u) in a string. Case insensitive.\n\nExamples:\n  count_vowels('hello') → 2\n  count_vowels('Python') → 1",
                StarterCode = "def count_vowels(s: str) -> int:\n    # Your code here\n    pass",
                TestCasesJson = "[{\"input\":\"hello\",\"expected\":\"2\"},{\"input\":\"Python\",\"expected\":\"1\"},{\"input\":\"aeiou\",\"expected\":\"5\"}]",
                Difficulty = Difficulty.Beginner, TimeLimitSeconds = 300, PassScore = 80, IsPublished = true,
            },
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "Check Palindrome",
                Description = "Write a function is_palindrome(s) that returns True if the string is a palindrome, False otherwise. Ignore case and spaces.\n\nExamples:\n  is_palindrome('racecar') → True\n  is_palindrome('hello') → False",
                StarterCode = "def is_palindrome(s: str) -> bool:\n    # Your code here\n    pass",
                TestCasesJson = "[{\"input\":\"racecar\",\"expected\":\"True\"},{\"input\":\"hello\",\"expected\":\"False\"},{\"input\":\"A man a plan a canal Panama\",\"expected\":\"True\"}]",
                Difficulty = Difficulty.Beginner, TimeLimitSeconds = 300, PassScore = 80, IsPublished = true,
            },
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "FizzBuzz Python",
                Description = "Write a function fizzbuzz(n) that returns:\n- 'Fizz' if n is divisible by 3\n- 'Buzz' if n is divisible by 5\n- 'FizzBuzz' if divisible by both\n- The number as string otherwise\n\nExamples:\n  fizzbuzz(3) → 'Fizz'\n  fizzbuzz(5) → 'Buzz'\n  fizzbuzz(15) → 'FizzBuzz'\n  fizzbuzz(7) → '7'",
                StarterCode = "def fizzbuzz(n: int) -> str:\n    # Your code here\n    pass",
                TestCasesJson = "[{\"input\":\"3\",\"expected\":\"Fizz\"},{\"input\":\"5\",\"expected\":\"Buzz\"},{\"input\":\"15\",\"expected\":\"FizzBuzz\"},{\"input\":\"7\",\"expected\":\"7\"}]",
                Difficulty = Difficulty.Beginner, TimeLimitSeconds = 300, PassScore = 80, IsPublished = true,
            },
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "Find Maximum",
                Description = "Write a function find_max(numbers) that returns the largest number in a list without using Python's built-in max() function.\n\nExamples:\n  find_max([3, 1, 4, 1, 5, 9]) → 9\n  find_max([10, 20, 5]) → 20",
                StarterCode = "def find_max(numbers: list) -> int:\n    # Your code here — do not use max()\n    pass",
                TestCasesJson = "[{\"input\":\"3 1 4 1 5 9\",\"expected\":\"9\"},{\"input\":\"10 20 5\",\"expected\":\"20\"},{\"input\":\"-3 -1 -4\",\"expected\":\"-1\"}]",
                Difficulty = Difficulty.Beginner, TimeLimitSeconds = 300, PassScore = 80, IsPublished = true,
            },
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "Fibonacci Sequence",
                Description = "Write a function fibonacci(n) that returns the nth Fibonacci number (0-indexed).\n\nExamples:\n  fibonacci(0) → 0\n  fibonacci(1) → 1\n  fibonacci(6) → 8",
                StarterCode = "def fibonacci(n: int) -> int:\n    # Your code here\n    pass",
                TestCasesJson = "[{\"input\":\"0\",\"expected\":\"0\"},{\"input\":\"1\",\"expected\":\"1\"},{\"input\":\"6\",\"expected\":\"8\"},{\"input\":\"10\",\"expected\":\"55\"}]",
                Difficulty = Difficulty.Intermediate, TimeLimitSeconds = 300, PassScore = 80, IsPublished = true,
            },
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "Two Sum",
                Description = "Write a function two_sum(nums, target) that returns the indices of the two numbers that add up to the target.\n\nExamples:\n  two_sum([2, 7, 11, 15], 9) → [0, 1]\n  two_sum([3, 2, 4], 6) → [1, 2]",
                StarterCode = "def two_sum(nums: list, target: int) -> list:\n    # Your code here\n    pass",
                TestCasesJson = "[{\"input\":\"2 7 11 15 | 9\",\"expected\":\"[0, 1]\"},{\"input\":\"3 2 4 | 6\",\"expected\":\"[1, 2]\"}]",
                Difficulty = Difficulty.Intermediate, TimeLimitSeconds = 400, PassScore = 75, IsPublished = true,
            },

            // ── C# ────────────────────────────────────────────────────────────
            new()
            {
                SkillId = csharp.Id, CreatedByUserId = admin.Id,
                Title = "FizzBuzz",
                Description = "Write a method FizzBuzz(int n) that returns:\n- 'Fizz' if n is divisible by 3\n- 'Buzz' if n is divisible by 5\n- 'FizzBuzz' if divisible by both\n- The number as string otherwise",
                StarterCode = "public class Solution\n{\n    public string FizzBuzz(int n)\n    {\n        // Your code here\n        return \"\";\n    }\n}",
                TestCasesJson = "[{\"input\":\"3\",\"expected\":\"Fizz\"},{\"input\":\"5\",\"expected\":\"Buzz\"},{\"input\":\"15\",\"expected\":\"FizzBuzz\"},{\"input\":\"7\",\"expected\":\"7\"}]",
                Difficulty = Difficulty.Beginner, TimeLimitSeconds = 300, PassScore = 80, IsPublished = true,
            },
            new()
            {
                SkillId = csharp.Id, CreatedByUserId = admin.Id,
                Title = "Check Armstrong Number",
                Description = "Write a method IsArmstrong(int n) that returns true if n is an Armstrong number (sum of digits each raised to the power of digit count equals the number).\n\nExamples:\n  IsArmstrong(153) → true  (1³ + 5³ + 3³ = 153)\n  IsArmstrong(100) → false",
                StarterCode = "public class Solution\n{\n    public bool IsArmstrong(int n)\n    {\n        // Your code here\n        return false;\n    }\n}",
                TestCasesJson = "[{\"input\":\"153\",\"expected\":\"True\"},{\"input\":\"100\",\"expected\":\"False\"},{\"input\":\"370\",\"expected\":\"True\"}]",
                Difficulty = Difficulty.Intermediate, TimeLimitSeconds = 300, PassScore = 80, IsPublished = true,
            },
            new()
            {
                SkillId = csharp.Id, CreatedByUserId = admin.Id,
                Title = "Reverse Words in a Sentence",
                Description = "Write a method ReverseWords(string s) that reverses the order of words in a sentence.\n\nExamples:\n  ReverseWords('Hello World') → 'World Hello'\n  ReverseWords('I love coding') → 'coding love I'",
                StarterCode = "public class Solution\n{\n    public string ReverseWords(string s)\n    {\n        // Your code here\n        return \"\";\n    }\n}",
                TestCasesJson = "[{\"input\":\"Hello World\",\"expected\":\"World Hello\"},{\"input\":\"I love coding\",\"expected\":\"coding love I\"}]",
                Difficulty = Difficulty.Beginner, TimeLimitSeconds = 300, PassScore = 80, IsPublished = true,
            },
            new()
            {
                SkillId = csharp.Id, CreatedByUserId = admin.Id,
                Title = "Find Prime Numbers",
                Description = "Write a method IsPrime(int n) that returns true if n is a prime number, false otherwise.\n\nExamples:\n  IsPrime(7) → true\n  IsPrime(10) → false\n  IsPrime(2) → true",
                StarterCode = "public class Solution\n{\n    public bool IsPrime(int n)\n    {\n        // Your code here\n        return false;\n    }\n}",
                TestCasesJson = "[{\"input\":\"7\",\"expected\":\"True\"},{\"input\":\"10\",\"expected\":\"False\"},{\"input\":\"2\",\"expected\":\"True\"},{\"input\":\"1\",\"expected\":\"False\"}]",
                Difficulty = Difficulty.Intermediate, TimeLimitSeconds = 300, PassScore = 80, IsPublished = true,
            },

            // ── React ─────────────────────────────────────────────────────────
            new()
            {
                SkillId = react.Id, CreatedByUserId = admin.Id,
                Title = "Build a Counter Component",
                Description = "Create a React component with increment, decrement, and reset buttons.\n\nRules:\n- Count must never go below 0\n- Reset sets count back to 0\n- Display the current count",
                StarterCode = "import { useState } from 'react';\n\nfunction Counter() {\n  // Your code here\n  return <div>Count: 0</div>;\n}\n\nexport default Counter;",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Beginner, TimeLimitSeconds = 600, PassScore = 70, IsPublished = true,
            },
            new()
            {
                SkillId = react.Id, CreatedByUserId = admin.Id,
                Title = "Todo List App",
                Description = "Build a simple Todo List React component with:\n- An input field to add new todos\n- A button to add the todo\n- Display all todos in a list\n- A button next to each todo to delete it\n- Show count of remaining todos",
                StarterCode = "import { useState } from 'react';\n\nfunction TodoList() {\n  // Your code here\n  return (\n    <div>\n      <h1>Todo List</h1>\n    </div>\n  );\n}\n\nexport default TodoList;",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Intermediate, TimeLimitSeconds = 900, PassScore = 70, IsPublished = true,
            },
            new()
            {
                SkillId = react.Id, CreatedByUserId = admin.Id,
                Title = "Traffic Light Component",
                Description = "Build a Traffic Light React component that:\n- Shows three circles (red, yellow, green)\n- Cycles through states automatically every 2 seconds: red → green → yellow → red\n- Highlights the active light\n- Has a Stop/Start button to pause/resume",
                StarterCode = "import { useState, useEffect } from 'react';\n\nfunction TrafficLight() {\n  // Your code here\n  return (\n    <div>\n      <div>Traffic Light</div>\n    </div>\n  );\n}\n\nexport default TrafficLight;",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Intermediate, TimeLimitSeconds = 900, PassScore = 70, IsPublished = true,
            },
            new()
            {
                SkillId = react.Id, CreatedByUserId = admin.Id,
                Title = "Star Rating Component",
                Description = "Build a Star Rating React component that:\n- Displays 5 stars\n- Highlights stars on hover\n- Saves selected rating on click\n- Displays the current rating below",
                StarterCode = "import { useState } from 'react';\n\nfunction StarRating() {\n  // Your code here\n  return (\n    <div>\n      <h2>Rate this</h2>\n    </div>\n  );\n}\n\nexport default StarRating;",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Intermediate, TimeLimitSeconds = 900, PassScore = 70, IsPublished = true,
            },

            // ── TypeScript ────────────────────────────────────────────────────
            new()
            {
                SkillId = ts.Id, CreatedByUserId = admin.Id,
                Title = "Type-Safe Stack",
                Description = "Implement a generic Stack<T> class in TypeScript with:\n- push(item: T): void\n- pop(): T | undefined\n- peek(): T | undefined\n- isEmpty(): boolean\n- size(): number",
                StarterCode = "class Stack<T> {\n  // Your code here\n  \n  push(item: T): void {\n    \n  }\n  \n  pop(): T | undefined {\n    return undefined;\n  }\n  \n  peek(): T | undefined {\n    return undefined;\n  }\n  \n  isEmpty(): boolean {\n    return true;\n  }\n  \n  size(): number {\n    return 0;\n  }\n}",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Intermediate, TimeLimitSeconds = 600, PassScore = 75, IsPublished = true,
            },
            new()
            {
                SkillId = ts.Id, CreatedByUserId = admin.Id,
                Title = "Flatten Nested Array",
                Description = "Write a TypeScript function flattenArray<T>(arr: any[]): T[] that flattens a deeply nested array.\n\nExamples:\n  flattenArray([1, [2, [3, [4]]]]) → [1, 2, 3, 4]\n  flattenArray([1, [2, 3], [4, [5]]]) → [1, 2, 3, 4, 5]",
                StarterCode = "function flattenArray<T>(arr: any[]): T[] {\n  // Your code here\n  return [];\n}",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Intermediate, TimeLimitSeconds = 400, PassScore = 75, IsPublished = true,
            },
        };

        db.Challenges.AddRange(challenges);
        await db.SaveChangesAsync();

        Console.WriteLine("========================================");
        Console.WriteLine("  Database seeded successfully!");
        Console.WriteLine($"  {challenges.Count} challenges added");
        Console.WriteLine("  Login: admin@skillbridge.dev");
        Console.WriteLine("  Pass:  Admin@123");
        Console.WriteLine("========================================");
    }
}
