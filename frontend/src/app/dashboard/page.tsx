'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import api from '@/lib/api';
import { useCountUp } from '@/hooks/useCountUp';
import { CardSkeleton } from '@/components/ui/Skeleton';
import type { Credential } from '@/types';

function StatCard({ label, value, highlight=false, delay=0 }: { label: string; value: number|string; highlight?: boolean; delay?: number }) {
  const n = useCountUp(typeof value === 'number' ? value : 0, 1000);
  const display = typeof value === 'string' ? value : n;
  return (
    <div className={`rounded-2xl border bg-deep/50 p-5 transition-all duration-300 animate-fade-up
                    ${highlight ? 'border-mauve/40' : 'border-royal hover:border-mauve/25'}`}
         style={{ animationDelay: `${delay}ms` }}>
      <p className={`text-3xl font-semibold mb-1 ${highlight ? 'text-mauve' : 'text-cream'}`}>{display}</p>
      <p className="text-[10px] text-blush/40 font-bold uppercase tracking-wider">{label}</p>
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

  // Radar: one spoke per earned skill, value = score on 0-5 scale
  const radarData = creds
    .filter(c => !c.isRevoked)
    .map(c => ({
      subject: c.skillName,
      value: Math.round(c.scorePercentile / 20 * 10) / 10,
      fullMark: 5,
    }));

  // Activity: real credential earn dates over last 7 days
  const activityData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayKey = d.toISOString().split('T')[0];
    const count = creds.filter(c => c.issuedAt?.startsWith(dayKey)).length;
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), submissions: count };
  });

  const avgScore = creds.length
    ? Math.round(creds.reduce((s,c)=>s+c.scorePercentile,0)/creds.length)
    : 0;

  return (
    <div className="min-h-screen bg-void pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8 animate-fade-up">
          <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-2">Your workspace</p>
          <h1 className="text-[36px] font-semibold text-cream tracking-tight mb-1">
            Welcome back, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-blush/35 text-sm">{user?.role} · {user?.email}</p>
        </div>

        {expiringSoon.length > 0 && (
          <div className="mb-6 rounded-2xl border border-mauve/25 bg-mauve/8 p-4
                          flex items-center gap-3 animate-fade-up">
            <div className="w-8 h-8 rounded-xl bg-mauve/20 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 12H1L7 1Z" stroke="#FF4F00" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M7 5v3M7 10h.01" stroke="#FF4F00" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-cream text-sm font-semibold">
                {expiringSoon.length} credential{expiringSoon.length>1?'s':''} expiring within 30 days
              </p>
              <p className="text-blush/40 text-xs mt-0.5">
                {expiringSoon.map(c=>c.skillName).join(', ')} — retake challenges to renew
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Credentials" value={creds.length}                              delay={0}   />
          <StatCard label="Active"      value={creds.filter(c=>!c.isRevoked).length}      delay={60}  />
          <StatCard label="Skills"      value={new Set(creds.map(c=>c.skillName)).size}   delay={120} />
          <StatCard label="Avg Score"   value={avgScore > 0 ? `${avgScore}%` : '—'}       delay={180} highlight={avgScore>0} />
        </div>

        {creds.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl border border-royal bg-deep/50 p-5 animate-fade-up [animation-delay:200ms]">
              <p className="text-[10px] font-bold text-blush/40 uppercase tracking-widest mb-4">
                Activity — Last 7 days
              </p>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#FF4F00" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#FF4F00" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill:'#C9C9CF', fontSize:10, opacity:0.4 }}
                         axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background:'#131316', border:'1px solid #26262B',
                            borderRadius:'10px', fontSize:'12px', color:'#FFF' }}
                           cursor={{ stroke:'rgba(255,79,0,0.15)' }} />
                  <Area type="monotone" dataKey="submissions" stroke="#FF4F00" strokeWidth={2}
                        fill="url(#activityGrad)"
                        dot={{ fill:'#FF4F00', r:4, strokeWidth:0 }}
                        activeDot={{ r:6, fill:'#FF6A1F', strokeWidth:0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border border-royal bg-deep/50 p-5 animate-fade-up [animation-delay:260ms]">
              <p className="text-[10px] font-bold text-blush/40 uppercase tracking-widest mb-4">
                Skills breakdown
              </p>
              {radarData.length >= 3 ? (
                <ResponsiveContainer width="100%" height={140}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,79,0,0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill:'#C9C9CF', fontSize:10, opacity:0.5 }} />
                    <Radar dataKey="value" stroke="#FF4F00" fill="#FF4F00" fillOpacity={0.18} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={radarData} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
                    <XAxis type="number" domain={[0, 5]} hide />
                    <YAxis type="category" dataKey="subject" tick={{ fill:'#C9C9CF', fontSize:11, opacity:0.6 }} width={72} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background:'#131316', border:'1px solid #26262B', borderRadius:'10px', fontSize:'12px', color:'#FFF' }}
                             cursor={{ fill:'rgba(255,79,0,0.06)' }}
                             formatter={(v) => [`${Math.round((v as number) * 20)}%`, 'Score']} />
                    <Bar dataKey="value" fill="#FF4F00" fillOpacity={0.85} radius={[0, 4, 4, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[140px] flex items-center justify-center">
                  <p className="text-blush/20 text-xs">Earn credentials to see breakdown</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-royal bg-deep/40 overflow-hidden animate-fade-up [animation-delay:300ms]">
          <div className="px-6 py-5 border-b border-royal flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-cream text-[15px] tracking-tight">Your Credentials</h2>
              <p className="text-blush/35 text-xs mt-0.5">Verified badges earned from challenges</p>
            </div>
            <Link href="/challenges"
              className="text-xs font-semibold text-mauve hover:text-gc-bright transition-colors">
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
              <p className="text-blush/30 text-sm mb-6">No credentials yet. Take a challenge to earn your first badge.</p>
              <Link href="/challenges"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                           bg-grad-btn text-cream font-semibold text-sm shadow-royal shadow-btn-inset
                           hover:shadow-mauve hover:-translate-y-px transition-all">
                Take your first challenge →
              </Link>
            </div>
          )}

          {creds.length > 0 && (
            <div className="divide-y divide-royal/50">
              {creds.map((c, i) => {
                const expiring = c.expiresAt
                  && new Date(c.expiresAt).getTime()-now.getTime() < 30*24*60*60*1000
                  && new Date(c.expiresAt).getTime() > now.getTime();
                return (
                  <div key={c.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-royal/20
                                transition-colors duration-200 animate-fade-up"
                    style={{ animationDelay: `${i*50}ms` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-grad-btn flex items-center justify-center
                                      text-cream text-xs font-bold shadow-royal flex-shrink-0">
                        {c.scorePercentile}%
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-cream text-sm">{c.skillName}</p>
                          {expiring && <span className="text-[10px] text-mauve font-semibold">⚠ Expiring soon</span>}
                        </div>
                        <p className="text-[11px] text-blush/30 mt-0.5">
                          {c.skillCategory} · {new Date(c.issuedAt).toLocaleDateString()}
                        </p>
                        {c.expiresAt && (
                          <div className="mt-1.5 w-24 h-0.5 bg-royal rounded-full overflow-hidden">
                            <div className="h-full bg-mauve rounded-full"
                                 style={{ width: `${Math.max(5, Math.min(100,
                                   (new Date(c.expiresAt).getTime()-now.getTime()) /
                                   (new Date(c.expiresAt).getTime()-new Date(c.issuedAt).getTime()) * 100
                                 ))}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                    <Link href={`/verify/${c.publicToken}`} target="_blank"
                      className="text-xs font-semibold border border-royal text-blush/50
                                 px-4 py-2 rounded-xl hover:border-mauve/40 hover:text-blush
                                 hover:bg-royal/30 transition-all flex-shrink-0">
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
