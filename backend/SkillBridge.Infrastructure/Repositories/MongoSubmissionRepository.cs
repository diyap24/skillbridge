using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using SkillBridge.Core.Interfaces;
using SkillBridge.Core.Models;

namespace SkillBridge.Infrastructure.Repositories;

public class MongoSubmissionRepository : ISubmissionRepository
{
    private readonly IMongoCollection<CodeSubmission> _collection;

    public MongoSubmissionRepository(IMongoClient client, IConfiguration config)
    {
        var dbName = config["MongoDB:DatabaseName"] ?? "skillbridge";
        var db = client.GetDatabase(dbName);
        _collection = db.GetCollection<CodeSubmission>("code_submissions");

        var indexKeys = Builders<CodeSubmission>.IndexKeys.Ascending(s => s.AttemptId);
        _collection.Indexes.CreateOne(new CreateIndexModel<CodeSubmission>(indexKeys));
    }

    public async Task<string> SaveAsync(CodeSubmission submission)
    {
        await _collection.InsertOneAsync(submission);
        return submission.Id!;
    }

    public async Task<CodeSubmission?> GetByAttemptIdAsync(Guid attemptId)
    {
        var filter = Builders<CodeSubmission>.Filter.Eq(s => s.AttemptId, attemptId);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }
}
