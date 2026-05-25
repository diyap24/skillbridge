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

            // ── Python Advanced ───────────────────────────────────────────────
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "Longest Common Subsequence",
                Description = "Write a function lcs(s1, s2) that returns the length of the longest common subsequence between two strings.\n\nExamples:\n  lcs('abcde', 'ace') → 3\n  lcs('abc', 'abc') → 3\n  lcs('abc', 'def') → 0",
                StarterCode = "def lcs(s1: str, s2: str) -> int:\n    # Your code here (use dynamic programming)\n    pass",
                TestCasesJson = "[{\"input\":\"abcde ace\",\"expected\":\"3\"},{\"input\":\"abc abc\",\"expected\":\"3\"},{\"input\":\"abc def\",\"expected\":\"0\"}]",
                Difficulty = Difficulty.Advanced, TimeLimitSeconds = 500, PassScore = 75, IsPublished = true,
            },
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "Binary Search",
                Description = "Write a function binary_search(arr, target) that returns the index of the target in a sorted list, or -1 if not found. Must run in O(log n) time.\n\nExamples:\n  binary_search([1,3,5,7,9], 5) → 2\n  binary_search([1,3,5,7,9], 6) → -1",
                StarterCode = "def binary_search(arr: list, target: int) -> int:\n    # Your code here — O(log n) required\n    pass",
                TestCasesJson = "[{\"input\":\"1 3 5 7 9 | 5\",\"expected\":\"2\"},{\"input\":\"1 3 5 7 9 | 6\",\"expected\":\"-1\"},{\"input\":\"2 4 6 8 10 | 2\",\"expected\":\"0\"}]",
                Difficulty = Difficulty.Advanced, TimeLimitSeconds = 400, PassScore = 75, IsPublished = true,
            },
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "Valid Parentheses",
                Description = "Write a function is_valid(s) that returns True if the string of brackets is valid (every open bracket has a matching close bracket in correct order).\n\nExamples:\n  is_valid('()[]{}') → True\n  is_valid('([)]') → False\n  is_valid('{[]}') → True",
                StarterCode = "def is_valid(s: str) -> bool:\n    # Your code here (hint: use a stack)\n    pass",
                TestCasesJson = "[{\"input\":\"()[]{}\"  ,\"expected\":\"True\"},{\"input\":\"([)]\"  ,\"expected\":\"False\"},{\"input\":\"{[]}\"  ,\"expected\":\"True\"}]",
                Difficulty = Difficulty.Advanced, TimeLimitSeconds = 400, PassScore = 75, IsPublished = true,
            },
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "Merge Intervals",
                Description = "Write a function merge_intervals(intervals) that merges all overlapping intervals and returns the result sorted.\n\nExample:\n  merge_intervals([[1,3],[2,6],[8,10],[15,18]]) → [[1,6],[8,10],[15,18]]\n  merge_intervals([[1,4],[4,5]]) → [[1,5]]",
                StarterCode = "def merge_intervals(intervals: list) -> list:\n    # Your code here\n    pass",
                TestCasesJson = "[{\"input\":\"1,3 2,6 8,10 15,18\",\"expected\":\"[[1, 6], [8, 10], [15, 18]]\"},{\"input\":\"1,4 4,5\",\"expected\":\"[[1, 5]]\"}]",
                Difficulty = Difficulty.Advanced, TimeLimitSeconds = 500, PassScore = 75, IsPublished = true,
            },

            // ── Python Expert ─────────────────────────────────────────────────
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "LRU Cache Implementation",
                Description = "Implement an LRU (Least Recently Used) Cache class with O(1) get and put operations.\n\nMethods:\n  get(key) → returns value or -1 if not found\n  put(key, value) → inserts or updates. Evicts LRU when capacity exceeded.\n\nExample:\n  cache = LRUCache(2)\n  cache.put(1, 1)\n  cache.put(2, 2)\n  cache.get(1) → 1\n  cache.put(3, 3)  # evicts key 2\n  cache.get(2) → -1",
                StarterCode = "class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        # Your setup here\n    \n    def get(self, key: int) -> int:\n        # Your code here\n        return -1\n    \n    def put(self, key: int, value: int) -> None:\n        # Your code here\n        pass",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Expert, TimeLimitSeconds = 600, PassScore = 70, IsPublished = true,
            },
            new()
            {
                SkillId = python.Id, CreatedByUserId = admin.Id,
                Title = "Word Ladder",
                Description = "Write a function word_ladder(begin, end, word_list) that returns the number of steps in the shortest transformation sequence from begin to end, changing one letter at a time. Each intermediate word must be in the word list. Return 0 if no sequence exists.\n\nExample:\n  word_ladder('hit', 'cog', ['hot','dot','dog','lot','log','cog']) → 5",
                StarterCode = "def word_ladder(begin: str, end: str, word_list: list) -> int:\n    # Your code here (hint: BFS)\n    pass",
                TestCasesJson = "[{\"input\":\"hit cog hot dot dog lot log cog\",\"expected\":\"5\"}]",
                Difficulty = Difficulty.Expert, TimeLimitSeconds = 600, PassScore = 70, IsPublished = true,
            },

            // ── C# Advanced ───────────────────────────────────────────────────
            new()
            {
                SkillId = csharp.Id, CreatedByUserId = admin.Id,
                Title = "Generic Binary Search Tree",
                Description = "Implement a generic BST class with Insert, Search, and InOrder traversal methods.\n\nMethods:\n  Insert(T value) — inserts a value\n  Search(T value) → bool — returns true if value exists\n  InOrder() → List<T> — returns sorted list",
                StarterCode = "public class BST<T> where T : IComparable<T>\n{\n    // Your node and tree implementation here\n    \n    public void Insert(T value)\n    {\n        \n    }\n    \n    public bool Search(T value)\n    {\n        return false;\n    }\n    \n    public List<T> InOrder()\n    {\n        return new List<T>();\n    }\n}",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Advanced, TimeLimitSeconds = 600, PassScore = 70, IsPublished = true,
            },
            new()
            {
                SkillId = csharp.Id, CreatedByUserId = admin.Id,
                Title = "Implement LINQ Select and Where",
                Description = "Implement custom extension methods MySelect<T, TResult> and MyWhere<T> that replicate LINQ's Select and Where without using the built-in LINQ methods.\n\nExample:\n  new[]{1,2,3,4,5}.MyWhere(x => x > 2).MySelect(x => x * 2) → [6, 8, 10]",
                StarterCode = "public static class LinqExtensions\n{\n    public static IEnumerable<TResult> MySelect<T, TResult>(\n        this IEnumerable<T> source, Func<T, TResult> selector)\n    {\n        // Your code here — do not use LINQ\n        yield break;\n    }\n    \n    public static IEnumerable<T> MyWhere<T>(\n        this IEnumerable<T> source, Func<T, bool> predicate)\n    {\n        // Your code here — do not use LINQ\n        yield break;\n    }\n}",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Advanced, TimeLimitSeconds = 600, PassScore = 70, IsPublished = true,
            },

            // ── C# Expert ─────────────────────────────────────────────────────
            new()
            {
                SkillId = csharp.Id, CreatedByUserId = admin.Id,
                Title = "Thread-Safe Singleton",
                Description = "Implement a thread-safe Singleton pattern in C# using double-checked locking. The singleton must:\n- Be lazily initialized\n- Be thread-safe without locking on every access\n- Have a Value property that returns a unique instance ID (Guid)\n- Have a static Instance property",
                StarterCode = "public class Singleton\n{\n    // Your implementation here\n    // Must be thread-safe with lazy initialization\n    \n    public Guid Value { get; } = Guid.NewGuid();\n    \n    public static Singleton Instance\n    {\n        get\n        {\n            // Your code here\n            return null!;\n        }\n    }\n}",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Expert, TimeLimitSeconds = 600, PassScore = 70, IsPublished = true,
            },

            // ── React Advanced ────────────────────────────────────────────────
            new()
            {
                SkillId = react.Id, CreatedByUserId = admin.Id,
                Title = "Custom useFetch Hook",
                Description = "Build a custom React hook useFetch(url) that:\n- Fetches data from a URL\n- Returns { data, loading, error }\n- Handles loading state\n- Handles error state\n- Cancels the fetch on component unmount\n- Re-fetches when URL changes",
                StarterCode = "import { useState, useEffect } from 'react';\n\nfunction useFetch(url) {\n  // Your hook implementation here\n  return { data: null, loading: true, error: null };\n}\n\n// Demo component\nfunction App() {\n  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/posts/1');\n  if (loading) return <div>Loading...</div>;\n  if (error) return <div>Error: {error}</div>;\n  return <div>{data?.title}</div>;\n}\n\nexport default App;",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Advanced, TimeLimitSeconds = 900, PassScore = 70, IsPublished = true,
            },
            new()
            {
                SkillId = react.Id, CreatedByUserId = admin.Id,
                Title = "Infinite Scroll Component",
                Description = "Build an Infinite Scroll component that:\n- Renders a list of items\n- Automatically loads more items when the user scrolls to the bottom\n- Shows a loading spinner while fetching\n- Stops loading when all items are loaded\n- Uses IntersectionObserver API",
                StarterCode = "import { useState, useEffect, useRef } from 'react';\n\nfunction InfiniteScroll() {\n  const [items, setItems] = useState([]);\n  const [page, setPage] = useState(1);\n  const [loading, setLoading] = useState(false);\n  const [hasMore, setHasMore] = useState(true);\n  const observerRef = useRef(null);\n  \n  // Your implementation here\n  \n  return (\n    <div>\n      {items.map(item => <div key={item.id}>{item.title}</div>)}\n      {loading && <div>Loading...</div>}\n      <div ref={observerRef} />\n    </div>\n  );\n}\n\nexport default InfiniteScroll;",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Advanced, TimeLimitSeconds = 1200, PassScore = 70, IsPublished = true,
            },

            // ── React Expert ──────────────────────────────────────────────────
            new()
            {
                SkillId = react.Id, CreatedByUserId = admin.Id,
                Title = "Build a State Management Library",
                Description = "Build a minimal React state management solution (similar to Zustand) with:\n- createStore(initialState, actions) function\n- useStore() hook to access state and actions\n- State updates trigger re-renders only in subscribed components\n- Support for multiple stores",
                StarterCode = "import { useState, useEffect, useRef } from 'react';\n\nfunction createStore(initialState, actions) {\n  // Your implementation here\n  // Return { useStore }\n  return {\n    useStore: () => [initialState, {}]\n  };\n}\n\n// Test your implementation\nconst { useStore } = createStore(\n  { count: 0 },\n  (set) => ({\n    increment: () => set(s => ({ count: s.count + 1 })),\n    decrement: () => set(s => ({ count: s.count - 1 })),\n  })\n);\n\nfunction Counter() {\n  const [state, actions] = useStore();\n  return (\n    <div>\n      <p>Count: {state.count}</p>\n      <button onClick={actions.increment}>+</button>\n      <button onClick={actions.decrement}>-</button>\n    </div>\n  );\n}\n\nexport default Counter;",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Expert, TimeLimitSeconds = 1800, PassScore = 65, IsPublished = true,
            },

            // ── TypeScript Advanced ────────────────────────────────────────────
            new()
            {
                SkillId = ts.Id, CreatedByUserId = admin.Id,
                Title = "Deep Readonly Type",
                Description = "Create a TypeScript utility type DeepReadonly<T> that makes all properties of an object (and nested objects) readonly recursively.\n\nExample:\n  type User = { name: string; address: { city: string } }\n  type ReadonlyUser = DeepReadonly<User>\n  // ReadonlyUser.name is readonly\n  // ReadonlyUser.address.city is readonly",
                StarterCode = "// Define the DeepReadonly utility type\ntype DeepReadonly<T> = any; // Replace 'any' with your implementation\n\n// Test it\ntype User = {\n  name: string;\n  age: number;\n  address: {\n    city: string;\n    country: string;\n  };\n};\n\ntype ReadonlyUser = DeepReadonly<User>;\n\n// This should cause a TypeScript error (uncomment to test):\n// const user: ReadonlyUser = { name: 'Diya', age: 25, address: { city: 'NY', country: 'US' } };\n// user.name = 'John'; // Error!\n// user.address.city = 'LA'; // Error!",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Advanced, TimeLimitSeconds = 600, PassScore = 70, IsPublished = true,
            },
            new()
            {
                SkillId = ts.Id, CreatedByUserId = admin.Id,
                Title = "Builder Pattern with TypeScript",
                Description = "Implement a type-safe Builder pattern for creating complex objects. Build a QueryBuilder class that constructs SQL-like queries with:\n- select(...fields)\n- from(table)\n- where(condition)\n- orderBy(field, direction)\n- limit(n)\n- build() returns the final query string",
                StarterCode = "class QueryBuilder {\n  // Your implementation here\n  \n  select(...fields: string[]): this {\n    return this;\n  }\n  \n  from(table: string): this {\n    return this;\n  }\n  \n  where(condition: string): this {\n    return this;\n  }\n  \n  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC'): this {\n    return this;\n  }\n  \n  limit(n: number): this {\n    return this;\n  }\n  \n  build(): string {\n    return '';\n  }\n}",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Advanced, TimeLimitSeconds = 600, PassScore = 70, IsPublished = true,
            },

            // ── TypeScript Expert ─────────────────────────────────────────────
            new()
            {
                SkillId = ts.Id, CreatedByUserId = admin.Id,
                Title = "Type-Safe Event Emitter",
                Description = "Build a fully type-safe EventEmitter class in TypeScript where:\n- Events and their payloads are defined via a generic type parameter\n- on(event, handler) is type-safe — handler receives correct payload type\n- emit(event, payload) is type-safe — payload must match event type\n- off(event, handler) removes a listener\n- TypeScript should error if wrong payload type is used",
                StarterCode = "type EventMap = Record<string, unknown>;\n\nclass EventEmitter<T extends EventMap> {\n  // Your implementation here\n  \n  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void): this {\n    return this;\n  }\n  \n  off<K extends keyof T>(event: K, handler: (payload: T[K]) => void): this {\n    return this;\n  }\n  \n  emit<K extends keyof T>(event: K, payload: T[K]): this {\n    return this;\n  }\n}\n\n// Test:\ntype AppEvents = {\n  login: { userId: string; timestamp: number };\n  logout: { userId: string };\n  message: string;\n};\n\nconst emitter = new EventEmitter<AppEvents>();",
                TestCasesJson = "[]",
                Difficulty = Difficulty.Expert, TimeLimitSeconds = 900, PassScore = 65, IsPublished = true,
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

    public static async Task SeedJobsAsync(AppDbContext db)
    {
        if (await db.JobPostings.AnyAsync()) return;

        var employer = await db.Users.FirstOrDefaultAsync(u => u.Email == "admin@skillbridge.dev");
        if (employer == null) return;

        var now = DateTime.UtcNow;

        var jobs = new List<JobPosting>
        {
            new()
            {
                EmployerId = employer.Id,
                Title = "Senior Frontend Engineer",
                Company = "Vercel",
                Location = "Remote · USA",
                Description = "Join Vercel's product team to build the next generation of developer tooling. You'll work on high-impact features used by millions of developers, owning everything from design to deployment. Strong React and TypeScript skills are essential.",
                RequiredSkillsJson = """["React","TypeScript"]""",
                PostedAt = now.AddDays(-1),
            },
            new()
            {
                EmployerId = employer.Id,
                Title = "Full-Stack Engineer",
                Company = "Stripe",
                Location = "Remote · Europe",
                Description = "Stripe is looking for a full-stack engineer to help build financial infrastructure for the internet. You'll work across the stack — from React dashboards to Python backend services — and ship features that handle billions in transactions.",
                RequiredSkillsJson = """["Python","React","TypeScript"]""",
                PostedAt = now.AddDays(-2),
            },
            new()
            {
                EmployerId = employer.Id,
                Title = ".NET Backend Engineer",
                Company = "Atlassian",
                Location = "Sydney · AU / Remote",
                Description = "Build scalable backend services powering Jira, Confluence, and Trello. You'll design APIs, work on high-availability systems, and mentor junior engineers. Deep C# and SQL experience required.",
                RequiredSkillsJson = """["C#","SQL"]""",
                PostedAt = now.AddDays(-3),
            },
            new()
            {
                EmployerId = employer.Id,
                Title = "Machine Learning Engineer",
                Company = "Hugging Face",
                Location = "Remote · Worldwide",
                Description = "Work at the frontier of open-source AI. You'll build training pipelines, optimize inference, and contribute to open-source libraries used by hundreds of thousands of researchers. Strong Python skills and ML fundamentals are a must.",
                RequiredSkillsJson = """["Python"]""",
                PostedAt = now.AddDays(-4),
            },
            new()
            {
                EmployerId = employer.Id,
                Title = "Platform Engineer — DevOps",
                Company = "Datadog",
                Location = "New York · Hybrid",
                Description = "Own Datadog's internal platform infrastructure. You'll design and operate container orchestration systems, improve CI/CD pipelines, and ensure reliability at massive scale. Docker and Kubernetes expertise is essential.",
                RequiredSkillsJson = """["Docker"]""",
                PostedAt = now.AddDays(-5),
            },
            new()
            {
                EmployerId = employer.Id,
                Title = "React Native Engineer",
                Company = "Linear",
                Location = "Remote · USA / EU",
                Description = "Linear is building the future of project management. As a React Native engineer you'll shape our mobile apps — crafting fast, polished UIs that developers love. You'll work closely with design and ship frequently.",
                RequiredSkillsJson = """["React","TypeScript"]""",
                PostedAt = now.AddDays(-6),
            },
            new()
            {
                EmployerId = employer.Id,
                Title = "Data Engineer",
                Company = "Snowflake",
                Location = "Remote · USA",
                Description = "Design and maintain data pipelines that power analytics at global scale. You'll model complex schemas, write performance-critical SQL, and collaborate with data science and product teams to deliver insights that drive decisions.",
                RequiredSkillsJson = """["SQL","Python"]""",
                PostedAt = now.AddDays(-7),
            },
            new()
            {
                EmployerId = employer.Id,
                Title = "TypeScript SDK Engineer",
                Company = "Anthropic",
                Location = "Remote · Worldwide",
                Description = "Build and maintain developer-facing SDKs and tooling for Claude APIs. You'll write TypeScript that developers depend on daily, maintain excellent documentation, and drive adoption across the ecosystem.",
                RequiredSkillsJson = """["TypeScript"]""",
                PostedAt = now.AddDays(-8),
            },
            new()
            {
                EmployerId = employer.Id,
                Title = "Backend Engineer — Payments",
                Company = "Wise",
                Location = "London · Hybrid",
                Description = "Build the backend systems that move money for millions of customers across 80+ countries. You'll work on mission-critical C# microservices, design fault-tolerant distributed systems, and ensure correctness at every layer.",
                RequiredSkillsJson = """["C#","SQL"]""",
                PostedAt = now.AddDays(-10),
            },
            new()
            {
                EmployerId = employer.Id,
                Title = "Frontend Engineer — Design Systems",
                Company = "Figma",
                Location = "Remote · USA",
                Description = "Build and evolve Figma's design system used by thousands of designers and engineers. You'll create accessible React components, write comprehensive tests, and set the standard for UI quality across the company.",
                RequiredSkillsJson = """["React","TypeScript"]""",
                PostedAt = now.AddDays(-12),
            },
        };

        db.JobPostings.AddRange(jobs);
        await db.SaveChangesAsync();

        Console.WriteLine($"  {jobs.Count} job postings seeded.");
    }
}
