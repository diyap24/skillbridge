'use client';
import { useState, use } from 'react';
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
  python: '# Write your solution here\n\ndef solution():\n    pass\n',
  javascript: '// Write your solution here\n\nfunction solution() {\n  \n}\n',
  csharp: '// Write your solution here\n',
  java: '// Write your solution here\n',
};

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(STARTER.python);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const { data: challenge, isLoading } = useQuery<ChallengeDetail>({
    queryKey: ['challenge', id],
    queryFn: () => api.get(`/challenges/${id}`).then((r) => r.data),
  });

  const submit = useMutation({
    mutationFn: () => api.post(`/challenges/${id}/submit`, { code, language }),
    onSuccess: (res) => setResult(res.data),
    onError: () => { router.push('/login'); },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-void">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-royal border-t-mauve rounded-full animate-spin" />
        <p className="text-blush/50 text-sm">Loading challenge...</p>
      </div>
    </div>
  );

  if (!challenge) return (
    <div className="flex flex-col items-center justify-center h-screen bg-void gap-4">
      <p className="text-blush/50">Challenge not found.</p>
      <Link href="/challenges" className="btn-ghost text-sm">Back to challenges</Link>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-void">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 glass-dark border-b border-royal/20 z-10">
        <div className="flex items-center gap-3">
          <Link href="/challenges"
            className="text-blush/40 hover:text-blush transition-colors duration-200 text-sm">
            ← Back
          </Link>
          <span className="text-royal/40">|</span>
          <span className="font-bold text-cream text-sm">{challenge.title}</span>
          <span className="text-xs bg-royal/20 text-blush/70 px-2.5 py-1 rounded-full border border-royal/30">
            {challenge.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {LANGUAGES.map((lang) => (
            <button key={lang}
              onClick={() => { setLanguage(lang); setCode(STARTER[lang]); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                ${language === lang
                  ? 'bg-gradient-to-r from-royal to-mauve text-cream shadow-lg shadow-royal/30'
                  : 'bg-royal/15 text-blush/60 hover:bg-royal/25 hover:text-blush'}`}>
              {lang}
            </button>
          ))}
          <button onClick={() => submit.mutate()} disabled={submit.isPending}
            className="ml-2 btn-primary text-sm px-5 py-2">
            {submit.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-cream/20 border-t-cream rounded-full animate-spin" />
                Running...
              </span>
            ) : 'Submit →'}
          </button>
        </div>
      </div>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        <div className="w-2/5 overflow-y-auto p-7 border-r border-royal/15 glass-dark">
          <div className="mb-6">
            <p className="text-xs text-mauve font-semibold uppercase tracking-widest mb-1">
              {challenge.skillName}
            </p>
            <div className="flex gap-4 text-xs text-blush/30 mb-4">
              <span>Pass: {challenge.passScore}%</span>
              <span>Time: {Math.round(challenge.timeLimitSeconds / 60)} min</span>
            </div>
            <p className="text-sm text-blush/60 leading-relaxed whitespace-pre-wrap">
              {challenge.description}
            </p>
          </div>

          {result && (
            <div className={`rounded-2xl border p-5 animate-fade-up
              ${result.status === 'Passed'
                ? 'bg-mauve/10 border-mauve/25'
                : 'bg-deep/40 border-royal/25'}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-2xl`}>
                  {result.status === 'Passed' ? '✅' : '❌'}
                </span>
                <div>
                  <p className={`font-bold text-sm
                    ${result.status === 'Passed' ? 'text-blush' : 'text-blush/60'}`}>
                    {result.status === 'Passed' ? 'Passed!' : 'Failed'}
                  </p>
                  <p className="text-xs text-blush/30">Score: {result.score}%</p>
                </div>
              </div>
              {result.credentialIssued && (
                <div className="bg-royal/20 border border-royal/30 rounded-xl p-3 mb-3">
                  <p className="text-blush text-xs font-semibold">
                    🏅 Credential issued! Check your dashboard.
                  </p>
                </div>
              )}
              <div className="space-y-1.5">
                {result.testCases.map((tc, i) => (
                  <div key={i}
                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg
                      ${tc.passed
                        ? 'bg-mauve/10 text-blush/70'
                        : 'bg-deep/50 text-blush/40'}`}>
                    <span>{tc.passed ? '✓' : '✗'}</span>
                    <span>Test {i + 1}: {tc.passed ? 'Pass' : 'Fail'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Editor */}
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
              padding: { top: 20, bottom: 20 },
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              renderLineHighlight: 'gutter',
            }}
          />
        </div>

      </div>
    </div>
  );
}