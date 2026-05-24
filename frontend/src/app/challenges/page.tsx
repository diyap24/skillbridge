'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { CardSkeleton } from '@/components/ui/Skeleton';
import type { Challenge } from '@/types';

const DIFFS = ['All','Beginner','Intermediate','Advanced','Expert'] as const;
const DIFF_STYLE: Record<string,string> = {
  Beginner:     'bg-mauve/15 text-blush border-mauve/25',
  Intermediate: 'bg-royal/20 text-cream border-royal/35',
  Advanced:     'bg-deep/50 text-blush/80 border-deep/80',
  Expert:       'bg-void/80 text-cream border-mauve/20',
};

export default function ChallengesPage() {
  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery<{ data: Challenge[] }>({
    queryKey: ['challenges', currentPage, filter],
    queryFn: () => {
      const diff = filter === 'All' ? '' : `&difficulty=${filter}`;
      return api.get(`/challenges?page=${currentPage}&pageSize=12${diff}`).then(r => r.data);
    },
  });

  const filtered = (data?.data ?? []).filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.skillName.toLowerCase().includes(search.toLowerCase())
  );

  const handleFilter = (d: string) => { setFilter(d); setCurrentPage(1); };
  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };

  return (
    <div className="min-h-screen bg-void pt-24 pb-20 px-6 relative">
      <div className="relative max-w-6xl mx-auto">

        <div className="mb-8 animate-fade-up">
          <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-2">All challenges</p>
          <h1 className="text-4xl font-black text-cream tracking-tight mb-1">Coding Challenges</h1>
          <p className="text-blush/40 text-sm">Solve a challenge. Earn a verified credential.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-up [animation-delay:80ms]">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blush/30"
                 width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input value={search} onChange={e => handleSearch(e.target.value)}
              placeholder="Search challenges or skills..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-deep/30 border border-royal/20
                         text-sm text-cream placeholder-blush/25 backdrop-blur-sm
                         focus:outline-none focus:border-mauve/50 focus:ring-2 focus:ring-mauve/10 transition-all" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {DIFFS.map(d => (
              <button key={d} onClick={() => handleFilter(d)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all
                  ${filter === d
                    ? 'bg-gradient-to-r from-royal to-mauve text-cream border-transparent shadow-royal'
                    : 'border-royal/20 text-blush/50 hover:border-royal/40 hover:text-blush/80'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {!isLoading && <p className="text-[11px] text-blush/25 mb-4">{filtered.length} challenge{filtered.length !== 1 ? 's' : ''}</p>}

        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({length:6}).map((_,i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-royal/20 bg-deep/20 p-10 text-center">
            <p className="text-blush/50 text-sm">Could not load challenges. Is the backend running?</p>
          </div>
        )}

        {!isLoading && filtered.length === 0 && data && (
          <div className="rounded-2xl border border-royal/20 bg-deep/20 p-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-blush/40 text-sm mb-3">No challenges match your search</p>
            <button onClick={() => { setSearch(''); handleFilter('All'); }}
              className="text-xs text-mauve hover:text-blush transition-colors">Clear filters</button>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c, i) => (
              <Link key={c.id} href={`/challenges/${c.id}`}
                className="group relative rounded-2xl overflow-hidden border border-royal/20
                           bg-deep/25 backdrop-blur-sm p-6 hover:border-mauve/40 hover:-translate-y-1
                           hover:shadow-[0_8px_32px_rgba(82,43,91,0.3)] transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i*55}ms` }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                pointer-events-none bg-gradient-to-br from-royal/15 via-transparent to-mauve/5" />
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border
                                   ${DIFF_STYLE[c.difficulty] ?? DIFF_STYLE.Beginner}`}>
                    {c.difficulty}
                  </span>
                  <span className="text-[11px] text-blush/25">{c.attemptCount} attempts</span>
                </div>
                <h3 className="font-bold text-cream text-[15px] mb-2 tracking-tight
                               group-hover:text-blush transition-colors duration-200">{c.title}</h3>
                <p className="text-blush/35 text-xs mb-5">
                  {c.skillName} · {Math.round(c.timeLimitSeconds / 60)} min · Pass {c.passScore}%
                </p>
                <div className="flex items-center gap-1.5 text-mauve text-xs font-semibold
                                opacity-0 group-hover:opacity-100 -translate-x-1
                                group-hover:translate-x-0 transition-all duration-300">
                  Start challenge →
                </div>
              </Link>
            ))}
          </div>
        )}

        {(data?.data.length ?? 0) === 12 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={currentPage===1}
              className="px-5 py-2.5 rounded-xl border border-royal/25 text-blush/50 text-sm
                         hover:border-mauve/40 hover:text-blush transition-all disabled:opacity-30">
              ← Prev
            </button>
            <span className="text-blush/40 text-sm font-semibold">Page {currentPage}</span>
            <button onClick={() => setCurrentPage(p => p+1)}
              className="px-5 py-2.5 rounded-xl border border-royal/25 text-blush/50 text-sm
                         hover:border-mauve/40 hover:text-blush transition-all">
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
