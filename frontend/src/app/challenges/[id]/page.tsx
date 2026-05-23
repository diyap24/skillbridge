'use client';
import { useState, use, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  python: '# Write your solution here\n\ndef solution():\n    pass\n',
  javascript: '// Write your solution here\n\nfunction solution() {\n  \n}\n',
  csharp: '// Write your solution here\n',
  java: '// Write your solution here\n',
};

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const savedLang = typeof window !== 'undefined' ? localStorage.getItem('sb_lang_'+id) as Lang : null;
  const [lang, setLang]             = useState<Lang>(savedLang || 'python');
  const [code, setCode]             = useState(STARTER[savedLang || 'python']);
  const [result, setResult]         = useState<SubmissionResult | null>(null);
  const [fontSize, setFontSize]     = useState(14);
  const [fullscreen, setFullscreen] = useState(false);
  const [timeLeft, setTimeLeft]     = useState<number | null>(null);
  const [progress, setProgress]     = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: ch, isLoading } = useQuery<ChallengeDetail>({
    queryKey: ['challenge', id],
    queryFn: () => api.get(`/challenges/${id}`).then(r => r.data),
  });

  // Submit mutation — declared before useEffect that references it
  const submit = useMutation({
    mutationFn: () => {
      setProgress(true);
      return api.post(`/challenges/${id}/submit`, { code, language: lang });
    },
    onSuccess: (res) => {
      setProgress(false);
      setResult(res.data);
      if (res.data.status === 'Passed') {
        toast.success('Challenge passed! 🎉', { duration: 4000 });
        if (res.data.credentialIssued)
          setTimeout(() => toast.success('🏅 Credential issued! Check dashboard.', { duration: 5000 }), 1200);
        import('canvas-confetti').then(({ default: confetti }) => {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 },
                     colors: ['#522B5B','#854F6C','#DFB6B2','#FBE4D8','#ffffff'] });
        });
      } else {
        toast.error('Not quite — check test results below.');
      }
    },
    onError: () => { setProgress(false); router.push('/login'); },
  });

  // Timer — use interval only, no direct setState in effect body
  useEffect(() => {
    if (!ch) return;
    let t = ch.timeLimitSeconds;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(t);
    timerRef.current = setInterval(() => {
      t -= 1;
       
      setTimeLeft(t);
      if (t <= 0) { clearInterval(timerRef.current!); timerRef.current = null; }
    }, 1000);
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  }, [ch]);

  // Keyboard shortcut
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

  const resetCode = () => {
    setCode(STARTER[lang]);
    toast('Code reset', { icon: '↺' });
  };

  const fmt = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  const timeColor = !timeLeft ? 'text-blush/50'
    : timeLeft > (ch?.timeLimitSeconds||300)*0.5 ? 'text-blush/60'
    : timeLeft > (ch?.timeLimitSeconds||300)*0.2 ? 'text-amber-400' : 'text-red-400';
  const passed = result?.status === 'Passed';

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-void">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-royal/40 border-t-mauve rounded-full animate-spin" />
        <p className="text-blush/40 text-xs">Loading challenge...</p>
      </div>
    </div>
  );

  if (!ch) return (
    <div className="flex flex-col items-center justify-center h-screen bg-void gap-3">
      <p className="text-blush/40">Challenge not found.</p>
      <Link href="/challenges" className="text-xs border border-royal/30 text-blush/50 px-4 py-2 rounded-xl hover:border-mauve/40 hover:text-blush transition-all">Back</Link>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-void overflow-hidden">
      {progress && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-royal via-mauve to-blush rounded-full" />
        </div>
      )}
      <div className="flex items-center justify-between px-4 h-14 flex-shrink-0 bg-void/90 backdrop-blur-md border-b border-royal/20">
        <div className="flex items-center gap-3 min-w-0 mr-4">
          <Link href="/challenges" className="text-blush/35 hover:text-blush/70 text-sm flex-shrink-0">←</Link>
          <span className="font-bold text-cream text-sm tracking-tight truncate">{ch.title}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 bg-royal/20 text-blush/60 border border-royal/25 hidden sm:inline">{ch.difficulty}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {timeLeft !== null && (
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-royal/15 border border-royal/20 ${timeColor} hidden sm:inline-flex`}>
              ⏱ {fmt(timeLeft)}
            </span>
          )}
          <button onClick={() => setFontSize(f => Math.max(10,f-1))} className="text-blush/40 hover:text-blush text-xs w-7 h-7 flex items-center justify-center rounded hover:bg-royal/15 transition-all hidden sm:flex">A-</button>
          <button onClick={() => setFontSize(f => Math.min(22,f+1))} className="text-blush/40 hover:text-blush text-xs w-7 h-7 flex items-center justify-center rounded hover:bg-royal/15 transition-all hidden sm:flex">A+</button>
          <button onClick={resetCode} title="Reset" className="text-blush/40 hover:text-blush text-sm w-7 h-7 flex items-center justify-center rounded hover:bg-royal/15 transition-all">↺</button>
          <button onClick={() => setFullscreen(f => !f)} className="text-blush/40 hover:text-blush text-xs w-7 h-7 flex items-center justify-center rounded hover:bg-royal/15 transition-all hidden sm:flex">{fullscreen ? '◀' : '▶'}</button>
          {LANGS.map(l => (
            <button key={l} onClick={() => switchLang(l)}
              className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all hidden sm:block ${lang===l?'bg-gradient-to-r from-royal to-mauve text-cream shadow-royal':'bg-royal/15 text-blush/50 hover:bg-royal/25'}`}>
              {l}
            </button>
          ))}
          <button onClick={() => submit.mutate()} disabled={submit.isPending}
            className="ml-1 px-4 py-1.5 rounded-lg bg-gradient-to-r from-royal to-mauve text-cream text-xs font-bold shadow-royal hover:shadow-mauve hover:-translate-y-px transition-all disabled:opacity-50 disabled:translate-y-0"
            title="Submit (Ctrl+Enter)">
            {submit.isPending ? (<span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-cream/25 border-t-cream rounded-full animate-spin" />Running...</span>) : 'Submit →'}
          </button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {!fullscreen && (
          <div className="w-[320px] xl:w-[380px] flex-shrink-0 overflow-y-auto p-5 border-r border-royal/15 bg-void/60 backdrop-blur-sm">
            <p className="text-[10px] font-bold text-mauve uppercase tracking-[0.2em] mb-1">{ch.skillName}</p>
            <div className="flex gap-4 text-[11px] text-blush/30 mb-4">
              <span>Pass: {ch.passScore}%</span>
              <span>Time: {Math.round(ch.timeLimitSeconds/60)} min</span>
            </div>
            <p className="text-sm text-blush/55 leading-relaxed whitespace-pre-wrap mb-4">{ch.description}</p>
            <p className="text-[10px] text-blush/20 bg-royal/10 rounded-lg px-3 py-2">💡 <kbd className="font-mono">Ctrl+Enter</kbd> to submit</p>
            {result && (
              <div className={`mt-5 rounded-xl border p-4 animate-fade-up ${passed?'border-mauve/25 bg-mauve/8':'border-royal/20 bg-deep/40'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{passed?'✅':'❌'}</span>
                  <div>
                    <p className={`text-sm font-bold ${passed?'text-blush':'text-blush/50'}`}>{passed?'Passed!':'Failed'}</p>
                    <p className="text-[11px] text-blush/30">Score: {result.score}%</p>
                  </div>
                </div>
                {result.credentialIssued && <div className="rounded-lg border border-royal/25 bg-royal/15 px-3 py-2 mb-3"><p className="text-xs font-semibold text-blush">🏅 Credential issued!</p></div>}
                <div className="space-y-1.5">
                  {result.testCases.map((t,i) => (
                    <div key={i} className={`text-xs px-3 py-2 rounded-lg ${t.passed?'bg-mauve/10 text-blush/70':'bg-deep/50 text-blush/40'}`}>
                      <span>{t.passed?'✓':'✗'}</span><span className="ml-2">Test {i+1}: {t.passed?'Pass':'Fail'}</span>
                      {!t.passed && <div className="mt-1 text-[10px] opacity-60">Expected: <span className="text-cream">{t.expected}</span> · Got: <span className="text-red-300">{t.actual}</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <Editor height="100%" language={lang} value={code} onChange={v => setCode(v||'')} theme="vs-dark"
            options={{ minimap:{enabled:false}, fontSize, lineNumbers:'on', scrollBeyondLastLine:false,
              automaticLayout:true, padding:{top:20,bottom:20}, cursorBlinking:'smooth',
              smoothScrolling:true, renderLineHighlight:'gutter' }} />
        </div>
      </div>
    </div>
  );
}