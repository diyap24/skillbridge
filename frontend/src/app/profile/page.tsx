'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import type { Credential } from '@/types';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.push('/login'); }, [isAuthenticated, router]);

  const { data: creds = [] } = useQuery<Credential[]>({
    queryKey: ['credentials'],
    queryFn: () => api.get('/credentials/mine').then(r => r.data),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-void pt-24 pb-20 px-6 relative">
      <div className="relative max-w-3xl mx-auto">

        <div className="mb-8 animate-fade-up">
          <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-2">Your profile</p>
          <h1 className="text-4xl font-black text-cream tracking-tight">Profile</h1>
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-8 mb-6 animate-fade-up">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-royal to-mauve
                            flex items-center justify-center text-cream text-3xl font-black
                            shadow-[0_0_30px_rgba(82,43,91,0.5)] flex-shrink-0">
              {user?.fullName?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black text-cream mb-1">{user?.fullName}</h2>
              <p className="text-blush/50 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 text-[11px] font-semibold px-3 py-1 rounded-full
                               bg-royal/20 text-blush/70 border border-royal/30">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-up [animation-delay:80ms]">
          {[
            { label: 'Credentials', value: creds.length },
            { label: 'Skills', value: new Set(creds.map(c=>c.skillName)).size },
            { label: 'Avg score', value: creds.length ? Math.round(creds.reduce((s,c)=>s+c.scorePercentile,0)/creds.length)+'%' : '—' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-5 text-center">
              <p className="text-2xl font-black text-cream mb-1">{s.value}</p>
              <p className="text-[11px] text-blush/40 font-semibold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Badge grid */}
        <div className="rounded-2xl border border-royal/20 bg-deep/20 backdrop-blur-sm overflow-hidden
                        animate-fade-up [animation-delay:160ms]">
          <div className="px-6 py-4 border-b border-royal/15">
            <h3 className="font-bold text-cream text-[15px]">Earned Badges</h3>
          </div>
          {creds.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-blush/30 text-sm mb-4">No badges yet</p>
              <Link href="/challenges"
                className="text-xs text-mauve hover:text-blush transition-colors">
                Take a challenge to earn your first →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5">
              {creds.map((c, i) => (
                <Link key={c.id} href={`/verify/${c.publicToken}`} target="_blank"
                  className="group rounded-xl border border-royal/20 bg-deep/30 p-4 text-center
                             hover:border-mauve/35 hover:-translate-y-1 transition-all duration-200
                             animate-fade-up"
                  style={{ animationDelay: `${i*50}ms` }}>
                  <div className="text-3xl mb-2">🏅</div>
                  <p className="font-bold text-cream text-sm mb-0.5">{c.skillName}</p>
                  <p className="text-[10px] text-blush/30">{c.skillCategory}</p>
                  <div className="mt-2 text-[11px] font-bold text-mauve">{c.scorePercentile}%</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Settings link */}
        <div className="mt-4 animate-fade-up [animation-delay:240ms]">
          <Link href="/settings"
            className="flex items-center justify-between rounded-2xl border border-royal/20
                       bg-deep/20 backdrop-blur-sm px-6 py-4 hover:border-mauve/35
                       hover:bg-deep/35 transition-all duration-200">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚙️</span>
              <div>
                <p className="font-semibold text-cream text-sm">Account Settings</p>
                <p className="text-[11px] text-blush/30">Change name, email, password</p>
              </div>
            </div>
            <span className="text-blush/30 text-sm">→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
