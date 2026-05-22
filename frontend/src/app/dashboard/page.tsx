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

  useEffect(() => { if (!isAuthenticated) router.push('/login'); }, [isAuthenticated, router]);

  const { data: credentials = [], isLoading } = useQuery<Credential[]>({
    queryKey: ['credentials'],
    queryFn: () => api.get('/credentials/mine').then((r) => r.data),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  const stats = [
    { label: 'Credentials',    value: credentials.length,                                                         gradient: 'from-royal to-mauve' },
    { label: 'Active badges',  value: credentials.filter((c) => !c.isRevoked).length,                             gradient: 'from-mauve to-blush' },
    { label: 'Skills verified', value: new Set(credentials.map((c) => c.skillName)).size,                         gradient: 'from-deep to-royal' },
    { label: 'Avg score',       value: credentials.length > 0 ? Math.round(credentials.reduce((s,c) => s+c.scorePercentile,0)/credentials.length)+'%' : '—', gradient: 'from-royal to-mauve' },
  ];

  return (
    <div className="min-h-screen bg-void pt-28 pb-20 px-6 relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-royal/10 top-0 right-[-100px]" />
      <div className="orb w-96 h-96 bg-deep/30 bottom-0 left-[-50px]" />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="text-mauve text-xs font-semibold uppercase tracking-widest mb-2">
            Your workspace
          </p>
          <h1 className="text-4xl font-black text-cream mb-1">
            Welcome back, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-blush/40 text-sm">{user?.role} · {user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={s.label}
              className="glass rounded-2xl p-5 animate-fade-up"
              style={{ animationDelay: `${i * 0.07}s` }}>
              <p className={`text-3xl font-black bg-gradient-to-br ${s.gradient}
                             bg-clip-text text-transparent mb-1`}>
                {s.value}
              </p>
              <p className="text-blush/40 text-xs font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Credentials */}
        <div className="glass rounded-3xl overflow-hidden animate-fade-up shadow-2xl shadow-void/40"
             style={{ animationDelay: '0.28s' }}>

          <div className="px-7 py-5 border-b border-royal/15 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-cream text-lg">Your Credentials</h2>
              <p className="text-blush/40 text-xs mt-0.5">Verified badges earned from challenges</p>
            </div>
            <Link href="/challenges"
              className="text-sm text-mauve hover:text-blush font-semibold
                         transition-colors duration-200 flex items-center gap-1">
              Earn more <span>→</span>
            </Link>
          </div>

          {isLoading && (
            <div className="p-10 text-center text-blush/30 text-sm">Loading credentials...</div>
          )}

          {!isLoading && credentials.length === 0 && (
            <div className="p-16 text-center">
              <div className="text-6xl mb-5 animate-float inline-block">🏅</div>
              <p className="text-blush/40 text-sm mb-6">
                No credentials yet. Take a challenge to earn your first badge.
              </p>
              <Link href="/challenges" className="btn-primary text-sm px-6 py-3">
                Take your first challenge →
              </Link>
            </div>
          )}

          {credentials.length > 0 && (
            <div className="divide-y divide-royal/10">
              {credentials.map((cred, i) => (
                <div key={cred.id}
                  className="px-7 py-4 flex items-center justify-between
                             hover:bg-royal/10 transition-colors duration-200
                             animate-slide-in"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-royal to-mauve
                                    flex items-center justify-center text-cream font-black text-sm
                                    shadow-lg shadow-royal/30 flex-shrink-0">
                      {cred.scorePercentile}%
                    </div>
                    <div>
                      <p className="font-semibold text-cream text-sm">{cred.skillName}</p>
                      <p className="text-xs text-blush/30 mt-0.5">
                        {cred.skillCategory} · Issued {new Date(cred.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link href={`/verify/${cred.publicToken}`} target="_blank"
                    className="text-xs border border-royal/30 text-blush/60 px-4 py-2 rounded-xl
                               hover:bg-royal/20 hover:border-mauve/40 hover:text-blush
                               transition-all duration-200 font-medium flex-shrink-0">
                    View Badge →
                  </Link>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
