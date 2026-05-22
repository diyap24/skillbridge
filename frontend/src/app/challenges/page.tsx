'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import type { Challenge } from '@/types';

const DIFF: Record<string, string> = {
  Beginner:     'bg-mauve/20 text-blush   border border-mauve/30',
  Intermediate: 'bg-royal/20 text-cream   border border-royal/40',
  Advanced:     'bg-deep/50  text-blush   border border-deep/80',
  Expert:       'bg-void/80  text-cream   border border-mauve/20',
};

export default function ChallengesPage() {
  const { data, isLoading, error } = useQuery<{ data: Challenge[] }>({
    queryKey: ['challenges'],
    queryFn: () => api.get('/challenges?page=1&pageSize=20').then((r) => r.data),
  });

  return (
    <div className="min-h-screen bg-void pt-28 pb-20 px-6 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-royal/20 top-0 right-0" />
      <div className="orb w-64 h-64 bg-deep/40 bottom-20 left-10" />

      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="mb-10 animate-fade-up">
          <p className="text-mauve text-xs font-semibold uppercase tracking-widest mb-2">
            All challenges
          </p>
          <h1 className="text-4xl font-black text-cream">Coding Challenges</h1>
          <p className="text-blush/50 mt-1 text-sm">
            Solve a challenge. Earn a verified credential.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shimmer-card h-44" />
            ))}
          </div>
        )}

        {error && (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-blush/70 text-sm">
              Could not load challenges. Is the backend running?
            </p>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.data.map((c, i) => (
              <Link key={c.id} href={`/challenges/${c.id}`}
                className="card group cursor-pointer animate-fade-up"
                style={{ animationDelay: `${i * 0.07}s` }}>

                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIFF[c.difficulty]}`}>
                    {c.difficulty}
                  </span>
                  <span className="text-xs text-blush/30">{c.attemptCount} attempts</span>
                </div>

                <h3 className="font-bold text-cream text-lg mb-2
                               group-hover:text-blush transition-colors duration-200">
                  {c.title}
                </h3>

                <p className="text-blush/40 text-xs mb-5">
                  {c.skillName} · {Math.round(c.timeLimitSeconds / 60)} min · Pass {c.passScore}%
                </p>

                <div className="flex items-center gap-1.5 text-mauve/70 text-xs font-medium
                                opacity-0 group-hover:opacity-100 translate-x-[-4px]
                                group-hover:translate-x-0 transition-all duration-300">
                  <span>Start challenge</span>
                  <span>→</span>
                </div>

              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
