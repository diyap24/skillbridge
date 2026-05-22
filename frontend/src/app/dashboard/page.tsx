'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import type { Credential } from '@/types';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  const { data: credentials = [], isLoading } = useQuery<Credential[]>({
    queryKey: ['credentials'],
    queryFn: () => api.get('/credentials/mine').then((r) => r.data),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {user?.role} · {user?.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Credentials earned',
            value: credentials.length,
            color: 'text-blue-600',
          },
          {
            label: 'Active badges',
            value: credentials.filter((c) => !c.isRevoked).length,
            color: 'text-green-600',
          },
          {
            label: 'Skills verified',
            value: new Set(credentials.map((c) => c.skillName)).size,
            color: 'text-purple-600',
          },
          {
            label: 'Avg score',
            value:
              credentials.length > 0
                ? Math.round(
                    credentials.reduce(
                      (sum, c) => sum + c.scorePercentile,
                      0
                    ) / credentials.length
                  ) + '%'
                : '—',
            color: 'text-orange-600',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-xl p-4">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Credentials table */}
      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Your Credentials</h2>
          <Link
            href="/challenges"
            className="text-sm text-blue-600 hover:underline font-medium">
            Earn more →
          </Link>
        </div>

        {isLoading && (
          <div className="p-8 text-center text-slate-400 text-sm">
            Loading credentials…
          </div>
        )}

        {!isLoading && credentials.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-400 text-sm mb-4">No credentials yet</p>
            <Link
              href="/challenges"
              className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg
                         hover:bg-blue-700 transition-colors">
              Take your first challenge
            </Link>
          </div>
        )}

        {credentials.length > 0 && (
          <div className="divide-y divide-slate-100">
            {credentials.map((cred) => (
              <div
                key={cred.id}
                className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 bg-blue-100 rounded-full flex items-center
                                justify-center text-blue-700 font-bold text-sm">
                    {cred.scorePercentile}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">
                      {cred.skillName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {cred.skillCategory} ·{' '}
                      {new Date(cred.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/verify/${cred.publicToken}`}
                  target="_blank"
                  className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5
                             rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  View Badge →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
