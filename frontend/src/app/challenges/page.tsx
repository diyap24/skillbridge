'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import type { Challenge } from '@/types';

const DIFF_COLORS: Record<string, string> = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced:     'bg-orange-100 text-orange-700',
  Expert:       'bg-red-100 text-red-700',
};

export default function ChallengesPage() {
  const { data, isLoading, error } = useQuery<{ data: Challenge[] }>({
    queryKey: ['challenges'],
    queryFn: () =>
      api.get('/challenges?page=1&pageSize=20').then((r) => r.data),
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Coding Challenges</h1>
        <p className="text-slate-500">Solve a challenge to earn a verified credential</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-3 w-3/4" />
              <div className="h-3 bg-slate-100 rounded mb-2 w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Could not load challenges. Is the backend running?</p>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/challenges/${challenge.id}`}
              className="bg-white border border-slate-200 rounded-xl p-5
                         hover:border-blue-300 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full
                               ${DIFF_COLORS[challenge.difficulty]}`}>
                  {challenge.difficulty}
                </span>
                <span className="text-xs text-slate-400">
                  {challenge.attemptCount} attempts
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1
                             group-hover:text-blue-600 transition-colors">
                {challenge.title}
              </h3>
              <p className="text-xs text-slate-500">
                {challenge.skillName} ·{' '}
                {Math.round(challenge.timeLimitSeconds / 60)} min ·{' '}
                Pass {challenge.passScore}%
              </p>
            </Link>
          ))}
        </div>
      )}

      {data?.data.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400">No challenges available yet.</p>
        </div>
      )}

    </div>
  );
}
