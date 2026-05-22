'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import type { ChallengeDetail, SubmissionResult } from '@/types';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = ['python', 'javascript', 'csharp', 'java'] as const;
type Language = (typeof LANGUAGES)[number];

const STARTER: Record<Language, string> = {
  python:     '# Write your solution here\n\ndef solution():\n    pass\n',
  javascript: '// Write your solution here\n\nfunction solution() {\n  \n}\n',
  csharp:     '// Write your solution here\n\npublic class Solution\n{\n    public void Solve()\n    {\n        \n    }\n}\n',
  java:       '// Write your solution here\n\npublic class Solution {\n    public void solve() {\n        \n    }\n}\n',
};

export default function ChallengePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(STARTER.python);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const { data: challenge, isLoading } = useQuery<ChallengeDetail>({
    queryKey: ['challenge', params.id],
    queryFn: () =>
      api.get(`/challenges/${params.id}`).then((r) => r.data),
  });

  const submit = useMutation({
    mutationFn: () =>
      api.post(`/challenges/${params.id}/submit`, { code, language }),
    onSuccess: (res) => setResult(res.data),
    onError: (err: any) => {
      if (err?.response?.status === 401) router.push('/login');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-400">
        Loading challenge…
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-slate-500">Challenge not found.</p>
        <Link href="/challenges" className="text-blue-600 hover:underline text-sm">
          Back to challenges
        </Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-57px)] flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white
                      border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/challenges" className="text-slate-400 hover:text-slate-600 text-sm">
            ← Back
          </Link>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-900 text-sm">
            {challenge.title}
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {challenge.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setCode(STARTER[lang]);
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors
                ${language === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {lang}
            </button>
          ))}

          <button
            onClick={() => submit.mutate()}
            disabled={submit.isPending}
            className="ml-2 bg-green-600 text-white text-sm px-5 py-1.5 rounded-lg
                       font-medium hover:bg-green-700 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed">
            {submit.isPending ? 'Running…' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel — description */}
        <div className="w-2/5 overflow-y-auto p-6 border-r border-slate-200 bg-white">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              {challenge.skillName}
            </h2>
            <div className="flex gap-3 text-xs text-slate-500 mb-4">
              <span>Pass: {challenge.passScore}%</span>
              <span>Time: {Math.round(challenge.timeLimitSeconds / 60)} min</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {challenge.description}
            </p>
          </div>

          {/* Result panel */}
          {result && (
            <div
              className={`rounded-xl border p-4 mt-4 ${
                result.status === 'Passed'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-sm font-semibold ${
                    result.status === 'Passed'
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}>
                  {result.status === 'Passed' ? '✓ Passed' : '✗ Failed'}
                </span>
                <span className="text-xs text-slate-500">
                  Score: {result.score}%
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                {result.runtimeMs}ms · {Math.round(result.memoryKb / 1024)}MB
              </p>

              {result.credentialIssued && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-blue-700 text-xs font-medium">
                    🏅 Credential issued! View it in your dashboard.
                  </p>
                </div>
              )}

              <div className="space-y-1">
                {result.testCases.map((tc, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded
                      ${tc.passed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'}`}>
                    <span>{tc.passed ? '✓' : '✗'}</span>
                    <span>Test {i + 1}</span>
                    {!tc.passed && (
                      <span className="text-red-500 ml-auto">
                        Expected: {tc.expected} | Got: {tc.actual}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {submit.isError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
              <p className="text-yellow-700 text-sm">
                You must be logged in as a Candidate to submit.{' '}
                <Link href="/login" className="underline font-medium">
                  Login here
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Right panel — editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(v) => setCode(v || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
              tabSize: 2,
            }}
          />
        </div>

      </div>
    </div>
  );
}
