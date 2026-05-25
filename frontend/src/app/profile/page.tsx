'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
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

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  useEffect(() => {
    setAvatarUrl(localStorage.getItem('sb_avatar'));
  }, []);

  if (!isAuthenticated) return null;

  const avgScore = creds.length
    ? Math.round(creds.reduce((s,c)=>s+c.scorePercentile,0)/creds.length)
    : 0;
  const topSkills = [...new Set(creds.map(c => c.skillName))].slice(0, 5);
  const joined = user ? new Date().toLocaleDateString('en-US', { month:'short', year:'numeric' }) : '';

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${user?.fullName} — SkillBridge Profile`, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Profile link copied to clipboard!');
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-void pt-28 pb-20 px-6 relative overflow-hidden">
      {/* Subtle halo */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[400px] rounded-full blur-[100px] opacity-30"
           style={{ background:'radial-gradient(ellipse, rgba(255,79,0,0.3) 0%, transparent 70%)' }} />

      <div className="relative max-w-5xl mx-auto">

        {/* Header card */}
        <div className="rounded-2xl border border-royal bg-deep/50 p-8 mb-6 animate-fade-up">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-grad-btn flex items-center justify-center
                              text-cream text-2xl font-bold shadow-[0_0_32px_rgba(255,79,0,0.4)]
                              border-2 border-mauve/40 flex-shrink-0 overflow-hidden">
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  : user?.fullName?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-cream mb-0.5">{user?.fullName}</h1>
                <p className="text-blush/45 text-sm mb-2">{user?.role} · {user?.email}</p>
                <div className="flex items-center gap-3 text-[12px]">
                  <span className="text-mauve font-semibold">{creds.length} credentials</span>
                  <span className="text-blush/25">·</span>
                  <span className="text-blush/50">{avgScore > 0 ? `${avgScore}% avg score` : 'No scores yet'}</span>
                  <span className="text-blush/25">·</span>
                  <span className="text-blush/40">Joined {joined}</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <button onClick={handleShare}
                className="px-4 py-2 rounded-xl border border-royal text-blush/50 text-xs font-semibold
                           hover:border-mauve/30 hover:text-blush transition-all">
                Share profile
              </button>
              <button onClick={handleDownloadPDF}
                className="px-4 py-2 rounded-xl border border-royal text-blush/50 text-xs font-semibold
                           hover:border-mauve/30 hover:text-blush transition-all">
                Download PDF
              </button>
              <Link href="/settings"
                className="px-4 py-2 rounded-xl bg-grad-btn text-cream text-xs font-semibold
                           shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px transition-all">
                Edit profile
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          {/* Left sidebar */}
          <div className="space-y-4 animate-fade-up [animation-delay:80ms]">
            <div className="rounded-2xl border border-royal bg-deep/50 p-5">
              <p className="text-[9px] font-bold text-blush/35 uppercase tracking-widest mb-3">About</p>
              <p className="text-blush/55 text-sm leading-relaxed">
                {user?.role === 'Employer'
                  ? 'Employer account. Post jobs and verify candidate credentials.'
                  : 'Building skills with verified credentials on SkillBridge.'}
              </p>
            </div>

            <div className="rounded-2xl border border-royal bg-deep/50 p-5">
              <p className="text-[9px] font-bold text-blush/35 uppercase tracking-widest mb-4">Stats</p>
              <div className="space-y-3">
                {[
                  { label: 'Challenges passed',    value: creds.length,        orange: false },
                  { label: 'Top-decile finishes',  value: creds.filter(c=>c.scorePercentile>=90).length, orange: true },
                  { label: 'Skills earned',        value: topSkills.length,    orange: false },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-[12px] text-blush/45">{s.label}</span>
                    <span className={`text-[13px] font-semibold ${s.orange ? 'text-mauve' : 'text-cream'}`}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {topSkills.length > 0 && (
              <div className="rounded-2xl border border-royal bg-deep/50 p-5">
                <p className="text-[9px] font-bold text-blush/35 uppercase tracking-widest mb-3">Top skills</p>
                <div className="flex flex-wrap gap-2">
                  {topSkills.map((s, i) => (
                    <span key={s}
                      className={`text-[12px] font-medium px-3 py-1 rounded-full border transition-colors
                        ${i === 0
                          ? 'bg-mauve/15 text-mauve border-mauve/30'
                          : 'bg-royal/30 text-blush/60 border-royal'}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Credentials grid */}
          <div className="animate-fade-up [animation-delay:140ms]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-cream text-[15px]">Verified credentials</h2>
              <span className="text-[11px] text-blush/30">Showing {Math.min(creds.length,6)} of {creds.length}</span>
            </div>

            {creds.length === 0 ? (
              <div className="rounded-2xl border border-royal bg-deep/40 p-12 text-center">
                <p className="text-blush/30 text-sm mb-4">No badges yet</p>
                <Link href="/challenges" className="text-xs text-mauve hover:text-gc-bright transition-colors">
                  Take a challenge to earn your first →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {creds.slice(0,5).map((c, i) => (
                  <Link key={c.id} href={`/verify/${c.publicToken}`} target="_blank"
                    className="group rounded-2xl border border-royal bg-deep/50 p-5
                               hover:border-mauve/40 hover:-translate-y-1
                               hover:shadow-[0_8px_24px_rgba(255,79,0,0.15)]
                               transition-all duration-200 animate-fade-up"
                    style={{ animationDelay: `${i*50}ms` }}>
                    <div className="w-12 h-12 rounded-2xl bg-grad-btn flex items-center justify-center
                                    text-cream text-sm font-bold shadow-royal mb-3">
                      {c.scorePercentile}%
                    </div>
                    <p className="font-semibold text-cream text-sm mb-0.5">{c.skillName}</p>
                    <p className="text-[10px] text-blush/35">{c.skillCategory}</p>
                    <p className="text-[10px] text-blush/25 mt-1">
                      {new Date(c.issuedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    </p>
                  </Link>
                ))}
                {/* Earn next badge */}
                <Link href="/challenges"
                  className="group rounded-2xl border border-dashed border-royal bg-deep/20 p-5
                             hover:border-mauve/30 hover:-translate-y-1 transition-all duration-200
                             flex flex-col items-center justify-center gap-2 min-h-[140px]">
                  <div className="w-10 h-10 rounded-full border border-royal/60 flex items-center justify-center
                                  text-blush/30 group-hover:border-mauve/30 group-hover:text-mauve transition-all text-lg">
                    +
                  </div>
                  <span className="text-[11px] text-blush/30 group-hover:text-blush/60 transition-colors text-center">
                    Earn next badge
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
