using SkillBridge.Core.Models;

namespace SkillBridge.Core.Interfaces;

public interface ISubmissionRepository
{
    Task<string> SaveAsync(CodeSubmission submission);
    Task<CodeSubmission?> GetByAttemptIdAsync(Guid attemptId);
}
