export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'Candidate' | 'Employer' | 'Admin';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
}

export interface Challenge {
  id: string;
  title: string;
  skillName: string;
  skillSlug: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  timeLimitSeconds: number;
  passScore: number;
  attemptCount: number;
}

export interface ChallengeDetail extends Challenge {
  description: string;
  starterCode: string;
  skillId: string;
}

export interface TestCaseResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface SubmissionResult {
  status: string;
  score: number;
  runtimeMs: number;
  memoryKb: number;
  testCases: TestCaseResult[];
  credentialIssued: boolean;
  credentialId?: string;
}

export interface Credential {
  id: string;
  candidateName: string;
  skillName: string;
  skillCategory: string;
  publicToken: string;
  scorePercentile: number;
  issuedAt: string;
  expiresAt?: string;
  isRevoked: boolean;
}
