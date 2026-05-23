'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
         LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import api from '@/lib/api';
import { useCountUp } from '@/hooks/useCountUp';
import { CardSkeleton } from '@/components/ui/Skeleton';
import type { Credential } from '@/types';

function StatCard({ label, value, delay=0 }: { label: string; value: number; delay?: number }) {
  const n = useCountUp(value, 1000);
  return (
    <div className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-5
                    hover:border-mauve/30 hover:shadow-[0_4px_24px_rgba(82,43,91,0.2)]
                    transition-all duration-300 animate-fade-up"
         style={{ animationDelay: `${delay}ms` }}>
      <p className="text-3xl font-black text-cream mb-1">{n}</p>
      <p className="text-[11px] text-blush/40 font-semibold uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.push('/login'); }, [isAuthenticated, router]);

  const { data: creds = [], isLoading } = useQuery<Credential[]>({
    queryKey: ['credentials'],
    queryFn: () => api.get('/credentials/mine').then(r => r.data),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  const now = new Date();
  const expiringSoon = creds.filter(c => {
    if (!c.expiresAt || c.isRevoked) return false;
    const diff = new Date(c.expiresAt).getTime() - now.getTime();
    return diff > 0 && diff < 30*24*60*60*1000;
  });

  const catMap: Record<string,number> = {};
  creds.forEach(c => { catMap[c.skillCategory] = (catMap[c.skillCategory]||0)+1; });
  const radarData = Object.entries(catMap).map(([subject,value]) => ({ subject, value, fullMark: 5 }));

  const activityData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate()-(6-i));
    return { day: d.toLocaleDateString('en-US',{weekday:'short'}), submissions: i===6 ? creds.length : 0 };
  });

  const avgScore = creds.length
    ? Math.round(creds.reduce((s,c)=>s+c.scorePercentile,0)/creds.length)
    : 0;

  return (
    <div className="min-h-screen bg-void pt-24 pb-20 px-6 relative overflow-hidden">
      <div className="relative max-w-5xl mx-auto">

        <div className="mb-8 animate-fade-up">
          <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-2">Your workspace</p>
          <h1 className="text-4xl font-black text-cream tracking-tight mb-1">
            Welcome back, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-blush/35 text-sm">{user?.role} · {user?.email}</p>
        </div>

        {expiringSoon.length > 0 && (
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/8 p-4
                          flex items-center gap-3 animate-fade-up backdrop-blur-sm">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <p className="text-amber-300 text-sm font-semibold">
                {expiringSoon.length} credential{expiringSoon.length>1?'s':''} expiring within 30 days
              </p>
              <p className="text-amber-400/50 text-xs mt-0.5">
                {expiringSoon.map(c=>c.skillName).join(', ')} — retake challenges to renew
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Credentials"  value={creds.length} delay={0} />
          <StatCard label="Active"       value={creds.filter(c=>!c.isRevoked).length} delay={60} />
          <StatCard label="Skills"       value={new Set(creds.map(c=>c.skillName)).size} delay={120} />
          <div className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-5
                          hover:border-mauve/30 transition-all duration-300 animate-fade-up [animation-delay:180ms]">
            <p className="text-3xl font-black text-cream mb-1">{avgScore > 0 ? avgScore+'%' : '—'}</p>
            <p className="text-[11px] text-blush/40 font-semibold uppercase tracking-wider">Avg score</p>
          </div>
        </div>

        {creds.length > 0 && (
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            <div className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-5
                            animate-fade-up [animation-delay:200ms]">
              <p className="text-[10px] font-bold text-blush/40 uppercase tracking-widest mb-4">
                Activity — Last 7 days
              </p>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={activityData}>
                  <XAxis dataKey="day" tick={{ fill: '#DFB6B2', fontSize: 10, opacity: 0.4 }}
                         axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background:'#2B124C', border:'1px solid rgba(133,79,108,0.3)',
                            borderRadius:'8px', fontSize:'12px', color:'#FBE4D8' }}
                           cursor={{ stroke:'rgba(133,79,108,0.2)' }} />
                  <Line type="monotone" dataKey="submissions" stroke="#854F6C" strokeWidth={2}
                        dot={{ fill:'#854F6C', r:3 }} activeDot={{ r:5, fill:'#DFB6B2' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-5
                            animate-fade-up [animation-delay:260ms]">
              <p className="text-[10px] font-bold text-blush/40 uppercase tracking-widest mb-4">
                Skills radar
              </p>
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={130}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(82,43,91,0.3)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill:'#DFB6B2', fontSize:10, opacity:0.5 }} />
                    <Radar dataKey="value" stroke="#854F6C" fill="#854F6C" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[130px] flex items-center justify-center">
                  <p className="text-blush/20 text-xs">Earn credentials to see radar</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-royal/20 bg-deep/20 backdrop-blur-sm
                        overflow-hidden animate-fade-up [animation-delay:300ms]">
          <div className="px-6 py-5 border-b border-royal/15 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-cream text-[15px] tracking-tight">Your Credentials</h2>
              <p className="text-blush/35 text-xs mt-0.5">Verified badges earned from challenges</p>
            </div>
            <Link href="/challenges"
              className="text-xs font-semibold text-mauve hover:text-blush transition-colors flex items-center gap-1">
              Earn more →
            </Link>
          </div>

          {isLoading && (
            <div className="p-6 space-y-3">
              {Array.from({length:2}).map((_,i) => <CardSkeleton key={i} />)}
            </div>
          )}

          {!isLoading && creds.length === 0 && (
            <div className="p-16 text-center">
              <svg className="w-20 h-20 mx-auto mb-5 text-royal/25" fill="none" viewBox="0 0 80 80" stroke="currentColor" strokeWidth="1.5">
                <circle cx="40" cy="32" r="16"/>
                <path d="M24 32l-8 24 24-10 24 10-8-24" strokeLinejoin="round"/>
                <circle cx="40" cy="32" r="6" fill="currentColor" stroke="none" opacity="0.3"/>
              </svg>
              <p className="text-blush/30 text-sm mb-6">No credentials yet. Take a challenge to earn your first badge.</p>
              <Link href="/challenges"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                           bg-gradient-to-r from-royal to-mauve text-cream font-semibold text-sm
                           shadow-royal hover:shadow-mauve hover:-translate-y-px transition-all">
                Take your first challenge →
              </Link>
            </div>
          )}

          {creds.length > 0 && (
            <div className="divide-y divide-royal/10">
              {creds.map((c, i) => {
                const expiring = c.expiresAt && new Date(c.expiresAt).getTime()-now.getTime() < 30*24*60*60*1000
                  && new Date(c.expiresAt).getTime() > now.getTime();
                return (
                  <div key={c.id}
                    className={`px-6 py-4 flex items-center justify-between hover:bg-royal/8
                                transition-colors duration-200 animate-fade-up
                                ${expiring ? 'border-l-2 border-amber-500/50' : ''}`}
                    style={{ animationDelay: `${i*50}ms` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-royal to-mauve
                                      flex items-center justify-center text-cream text-xs font-black
                                      shadow-royal flex-shrink-0">
                        {c.scorePercentile}%
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-cream text-sm tracking-tight">{c.skillName}</p>
                          {expiring && <span className="text-[10px] text-amber-400 font-semibold">⚠ Expiring soon</span>}
                        </div>
                        <p className="text-[11px] text-blush/30 mt-0.5">
                          {c.skillCategory} · {new Date(c.issuedAt).toLocaleDateString()}
                        </p>
                        {c.expiresAt && (
                          <div className="mt-1.5 w-24 h-0.5 bg-royal/20 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-royal to-mauve rounded-full"
                                 style={{ width: `${Math.max(5, Math.min(100,
                                   (new Date(c.expiresAt).getTime()-now.getTime()) /
                                   (new Date(c.expiresAt).getTime()-new Date(c.issuedAt).getTime()) * 100
                                 ))}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                    <Link href={`/verify/${c.publicToken}`} target="_blank"
                      className="text-xs font-semibold border border-royal/30 text-blush/50
                                 px-4 py-2 rounded-xl hover:border-mauve/40 hover:text-blush
                                 hover:bg-royal/15 transition-all flex-shrink-0">
                      View Badge →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
