'use client';
import { useState, use, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import type { ChallengeDetail, SubmissionResult } from '@/types';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });
const LANGS = ['python','javascript','csharp','java'] as const;
type Lang = (typeof LANGS)[number];
const STARTER: Record<Lang,string> = {
  python:     '# Write your solution here\n\ndef solution():\n    pass\n',
  javascript: '// Write your solution here\n\nfunction solution() {\n  \n}\n',
  csharp:     '// Write your solution here\n',
  java:       '// Write your solution here\n',
};
const LANG_LABEL: Record<Lang,string> = { python:'Py', javascript:'JS', csharp:'C#', java:'Java' };

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router      = useRouter();
  const queryClient = useQueryClient();
  const savedLang = typeof window !== 'undefined' ? localStorage.getItem('sb_lang_'+id) as Lang : null;
  const [lang,       setLang]       = useState<Lang>(savedLang || 'python');
  const [code,       setCode]       = useState(STARTER[savedLang || 'python']);
  const [result,     setResult]     = useState<SubmissionResult | null>(null);
  const [fontSize,   setFontSize]   = useState(14);
  const [timeLeft,   setTimeLeft]   = useState<number | null>(null);
  const [progress,   setProgress]   = useState(false);
  const [activeFile, setActiveFile] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: ch, isLoading } = useQuery<ChallengeDetail>({
    queryKey: ['challenge', id],
    queryFn: () => api.get(`/challenges/${id}`).then(r => r.data),
  });

  const submit = useMutation({
    mutationFn: () => {
      setProgress(true);
      return api.post(`/challenges/${id}/submit`, { code, language: lang });
    },
    onSuccess: (res) => {
      setProgress(false);
      setResult(res.data);
      if (res.data.status === 'Passed') {
        queryClient.invalidateQueries({ queryKey: ['credentials'] });
        toast.success('Challenge passed! 🎉', { duration: 4000 });
        if (res.data.credentialIssued)
          setTimeout(() => toast.success('🏅 Credential issued! Check dashboard.', { duration: 5000 }), 1200);
        import('canvas-confetti').then(({ default: confetti }) => {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 },
                     colors: ['#FF4F00','#FF6A1F','#D63A00','#C9C9CF','#ffffff'] });
        });
      } else {
        toast.error('Not quite — check test results below.');
      }
    },
    onError: () => { setProgress(false); router.push('/login'); },
  });

  useEffect(() => {
    if (!ch) return;
    let t = ch.timeLimitSeconds;
    setTimeLeft(t);
    timerRef.current = setInterval(() => {
      t -= 1;
      setTimeLeft(t);
      if (t <= 0) { clearInterval(timerRef.current!); timerRef.current = null; }
    }, 1000);
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  }, [ch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!submit.isPending) submit.mutate();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [submit]);

  const switchLang = (l: Lang) => {
    setLang(l); setCode(STARTER[l]);
    localStorage.setItem('sb_lang_'+id, l);
  };

  const fmt = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  const timeWarn = timeLeft !== null && ch && timeLeft < ch.timeLimitSeconds * 0.2;
  const passed   = result?.status === 'Passed';

  // Derive file tabs from language
  const fileTabs = lang === 'csharp' ? ['solution.cs','tests.cs']
    : lang === 'python' ? ['solution.py','tests.py']
    : lang === 'java'   ? ['Solution.java','Tests.java']
    : ['solution.js','tests.js'];

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-void">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-royal border-t-mauve rounded-full animate-spin" />
        <p className="text-blush/40 text-xs font-mono">Loading challenge...</p>
      </div>
    </div>
  );

  if (!ch) return (
    <div className="flex flex-col items-center justify-center h-screen bg-void gap-3">
      <p className="text-blush/40">Challenge not found.</p>
      <Link href="/challenges" className="text-xs border border-royal text-blush/50 px-4 py-2 rounded-xl hover:border-mauve/40 hover:text-blush transition-all">Back</Link>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-void overflow-hidden">
      {/* Progress bar */}
      {progress && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-mauve via-gc-bright to-gc-soft rounded-full animate-pulse" />
        </div>
      )}

      {/* Sub-header: breadcrumb + timer + submit */}
      <div className="flex items-center justify-between px-5 h-12 flex-shrink-0 mt-[72px]
                      bg-deep/80 backdrop-blur-md border-b border-royal">
        <div className="flex items-center gap-2 min-w-0 text-sm">
          <Link href="/challenges" className="text-blush/35 hover:text-blush/70 transition-colors flex-shrink-0">
            ← All challenges
          </Link>
          <span className="text-blush/20">/</span>
          <span className="text-blush/50 font-mono text-xs truncate">
            {ch.skillName} · {ch.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {timeLeft !== null && (
            <div className={`flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5
                             rounded-lg bg-deep border border-royal ${timeWarn ? 'text-red-400 border-red-800/40' : 'text-blush/50'}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${timeWarn ? 'bg-red-400 animate-pulse' : 'bg-mauve'}`} />
              {fmt(timeLeft)} remaining
            </div>
          )}
          <div className="flex gap-1">
            {LANGS.map(l => (
              <button key={l} onClick={() => switchLang(l)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all
                  ${lang===l ? 'bg-grad-btn text-cream shadow-royal' : 'text-blush/40 hover:text-blush/70 hover:bg-royal/40'}`}>
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>
          <button onClick={() => submit.mutate()} disabled={submit.isPending}
            className="px-5 py-1.5 rounded-full bg-grad-btn text-cream text-xs font-bold
                       shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px
                       transition-all disabled:opacity-50 disabled:translate-y-0"
            title="Submit (Ctrl+Enter)">
            {submit.isPending
              ? <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-cream/25 border-t-cream rounded-full animate-spin"/>Running...</span>
              : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: description panel */}
        <div className="w-[300px] xl:w-[340px] flex-shrink-0 overflow-y-auto border-r border-royal bg-deep/40">
          <div className="p-5">
            <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full
                             bg-mauve/15 text-mauve border border-mauve/25 mb-4">
              {ch.difficulty}
            </span>
            <h2 className="text-[18px] font-semibold text-cream tracking-tight mb-3">{ch.title}</h2>
            <p className="text-blush/50 text-sm leading-relaxed mb-5">{ch.description}</p>

            {/* Stat boxes */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { label:'Time', value: `${Math.round(ch.timeLimitSeconds/60)}`, unit:'min' },
                { label:'Pass', value: `${ch.passScore}`, unit:'%'              },
                { label:'Attempts', value: `${ch.attemptCount}`, unit:''        },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-royal bg-void/60 px-3 py-3 text-center">
                  <p className="text-[15px] font-semibold text-mauve leading-none">
                    {s.value}<span className="text-[10px] text-mauve/70">{s.unit}</span>
                  </p>
                  <p className="text-[9px] font-bold text-blush/30 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Requirements */}
            <p className="text-[9px] font-bold text-blush/30 uppercase tracking-widest mb-3">Requirements</p>
            <ul className="space-y-2 mb-5">
              {[
                `Write a correct ${ch.skillName} solution`,
                `Pass ${ch.passScore}% of test cases`,
                `Complete within ${Math.round(ch.timeLimitSeconds/60)} minutes`,
              ].map((req, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-blush/55 leading-relaxed">
                  <svg className="flex-shrink-0 mt-0.5" width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M0 4L3 7L8 1" stroke="#FF4F00" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {req}
                </li>
              ))}
            </ul>

            <p className="text-[10px] text-blush/20 bg-royal/20 rounded-lg px-3 py-2 font-mono">
              <kbd>Ctrl+Enter</kbd> to submit
            </p>

            {/* Result panel */}
            {result && (
              <div className={`mt-5 rounded-xl border p-4 animate-fade-up
                ${passed ? 'border-mauve/30 bg-mauve/8' : 'border-royal bg-void/40'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{passed ? '✅' : '❌'}</span>
                  <div>
                    <p className={`text-sm font-semibold ${passed ? 'text-cream' : 'text-blush/50'}`}>
                      {passed ? 'Passed!' : 'Failed'}
                    </p>
                    <p className="text-[11px] text-blush/30">Score: {result.score}%</p>
                  </div>
                </div>
                {result.credentialIssued && (
                  <div className="rounded-lg border border-mauve/25 bg-mauve/10 px-3 py-2 mb-3">
                    <p className="text-xs font-semibold text-mauve">🏅 Credential issued!</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  {result.testCases.map((t,i) => (
                    <div key={i} className={`text-xs px-3 py-2 rounded-lg font-mono
                      ${t.passed ? 'bg-mauve/10 text-blush/70' : 'bg-void/60 text-blush/40'}`}>
                      <span>{t.passed ? '✓' : '✗'}</span>
                      <span className="ml-2">Test {i+1}: {t.passed ? 'Pass' : 'Fail'}</span>
                      {!t.passed && (
                        <div className="mt-1 text-[10px] opacity-60">
                          Expected: <span className="text-cream">{t.expected}</span>
                          {' · '}Got: <span className="text-red-300">{t.actual}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: editor + test runner */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File tabs */}
          <div className="flex items-center gap-0 border-b border-royal bg-void/80 px-2 flex-shrink-0">
            {fileTabs.map((f, i) => (
              <button key={f} onClick={() => setActiveFile(i)}
                className={`px-4 py-2.5 text-[12px] font-mono transition-all border-b-2
                  ${activeFile === i
                    ? 'text-cream border-mauve'
                    : 'text-blush/35 border-transparent hover:text-blush/60'}`}>
                {f}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 pr-3">
              <button onClick={() => setFontSize(f => Math.max(10,f-1))}
                className="text-blush/30 hover:text-blush text-xs px-1.5 transition-colors">A-</button>
              <button onClick={() => setFontSize(f => Math.min(22,f+1))}
                className="text-blush/30 hover:text-blush text-xs px-1.5 transition-colors">A+</button>
            </div>
          </div>

          {/* Monaco editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={lang === 'csharp' ? 'csharp' : lang}
              value={code}
              onChange={v => setCode(v||'')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                renderLineHighlight: 'gutter',
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              }}
            />
          </div>

          {/* Test runner panel */}
          {result && (
            <div className="border-t border-royal bg-deep/80 flex-shrink-0 max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-royal/50">
                <p className="text-[10px] font-bold text-blush/35 uppercase tracking-widest">Test runner</p>
                <span className="text-[11px] font-mono text-blush/40">
                  {result.testCases.filter(t=>t.passed).length} / {result.testCases.length} passing
                </span>
              </div>
              <div className="divide-y divide-royal/30">
                {result.testCases.map((t, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-2.5 text-xs font-mono
                    ${t.passed ? 'text-blush/60' : 'text-red-400/70'}`}>
                    <div className="flex items-center gap-2">
                      <span className={t.passed ? 'text-mauve' : 'text-red-400'}>
                        {t.passed ? '✓' : '✗'}
                      </span>
                      <span>test_{i+1}</span>
                    </div>
                    {!t.passed && (
                      <span className="text-red-400/60">
                        expected {t.expected} · got {t.actual}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
