using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SkillBridge.Core.Models;

public class CodeSubmission
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public Guid AttemptId { get; set; }
    public Guid UserId { get; set; }
    public Guid ChallengeId { get; set; }
    public string Language { get; set; } = string.Empty;
    public string SourceCode { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public ExecutionResult? Result { get; set; }
}

public class ExecutionResult
{
    public string Status { get; set; } = string.Empty;
    public int RuntimeMs { get; set; }
    public int MemoryKb { get; set; }
    public List<TestCaseResult> TestCases { get; set; } = [];
    public string? Stderr { get; set; }
}

public class TestCaseResult
{
    public string Input { get; set; } = string.Empty;
    public string Expected { get; set; } = string.Empty;
    public string Actual { get; set; } = string.Empty;
    public bool Passed { get; set; }
}