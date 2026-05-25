'use client';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/auth.store';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredSkills: string[];
  postedAt: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return '1d ago';
  if (d < 7)  return `${d}d ago`;
  return `${Math.floor(d/7)}w ago`;
}

function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const { user } = useAuthStore();
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const handleApply = () => {
    setSent(true);
    setTimeout(() => {
      onClose();
      toast.success(`Application sent to ${job.company}!`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="absolute inset-0 bg-void/80 backdrop-blur-md" />
      <div className="relative w-full max-w-lg bg-deep border border-royal rounded-3xl
                      shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden animate-fade-up"
           onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-royal">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-grad-btn flex items-center justify-center
                              text-cream font-bold text-[17px] shadow-royal flex-shrink-0">
                {job.company[0]}
              </div>
              <div>
                <h2 className="font-semibold text-cream text-[16px] tracking-tight">{job.title}</h2>
                <p className="text-blush/45 text-sm">{job.company} · {job.location}</p>
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full border border-royal flex items-center justify-center
                         text-blush/40 hover:text-cream hover:border-mauve/40 transition-all flex-shrink-0 mt-1">
              <svg width="11" height="11" fill="none" viewBox="0 0 11 11">
                <path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {!sent ? (
          <div className="p-7 space-y-5">
            {/* Applicant info — pre-filled */}
            <div>
              <p className="text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">Applying as</p>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-royal bg-void/40">
                <div className="w-8 h-8 rounded-full bg-grad-btn flex items-center justify-center
                                text-cream text-[11px] font-bold flex-shrink-0">
                  {user?.fullName?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-cream">{user?.fullName ?? 'Guest'}</p>
                  <p className="text-[11px] text-blush/35">{user?.email ?? '—'}</p>
                </div>
              </div>
            </div>

            {/* Required skills match */}
            <div>
              <p className="text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">Required skills</p>
              <div className="flex gap-2 flex-wrap">
                {job.requiredSkills.map(skill => (
                  <span key={skill}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full
                               bg-mauve/10 text-mauve border border-mauve/25">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Cover note */}
            <div>
              <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">
                Cover note <span className="text-blush/20 normal-case font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder={`Tell ${job.company} why you're a great fit...`}
                className="w-full bg-void/60 border border-royal rounded-xl px-4 py-2.5 text-sm text-cream
                           placeholder-blush/20 focus:outline-none focus:border-mauve/50
                           focus:ring-2 focus:ring-mauve/10 transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-royal text-blush/50 text-sm font-semibold
                           hover:border-mauve/30 hover:text-blush transition-all">
                Cancel
              </button>
              <button onClick={handleApply}
                className="flex-1 py-2.5 rounded-xl bg-grad-btn text-cream font-semibold text-sm
                           shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px transition-all">
                Send application →
              </button>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-mauve/15 border border-mauve/25 flex items-center
                            justify-center mx-auto mb-4">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M5 12l5 5L20 7" stroke="#FF4F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-semibold text-cream text-[16px] mb-1">Application sent!</p>
            <p className="text-blush/40 text-sm">You'll hear back from {job.company} soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: () => api.get('/jobs').then(r => r.data),
  });

  const filtered = useMemo(() =>
    jobs.filter(j =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.requiredSkills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    ), [jobs, search]);

  return (
    <div className="min-h-screen bg-void pt-28 pb-20 px-6">
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}

      <div className="max-w-4xl mx-auto">

        <div className="flex items-start justify-between mb-8 animate-fade-up">
          <div>
            <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-2">Opportunities</p>
            <h1 className="text-[36px] font-semibold text-cream tracking-tight mb-1">Job Board</h1>
            <p className="text-blush/40 text-sm">Jobs matched to your verified skills</p>
          </div>
          {isAuthenticated && user?.role === 'Employer' && (
            <Link href="/jobs/post"
              className="px-5 py-2.5 rounded-full bg-grad-btn text-cream font-semibold text-sm
                         shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px transition-all">
              Post a Job +
            </Link>
          )}
        </div>

        <div className="relative mb-6 animate-fade-up [animation-delay:60ms]">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-blush/30"
               width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company, or skill..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-deep/60 border border-royal
                       text-sm text-cream placeholder-blush/25
                       focus:outline-none focus:border-mauve/50 focus:ring-2 focus:ring-mauve/10 transition-all" />
        </div>

        {isLoading && <div className="space-y-4">{Array.from({length:3}).map((_,i)=><CardSkeleton key={i}/>)}</div>}

        {!isLoading && filtered.length === 0 && (
          <div className="rounded-2xl border border-royal bg-deep/20 p-16 text-center">
            <p className="text-blush/40 text-sm mb-2">
              {jobs.length === 0 ? 'No jobs posted yet.' : 'No jobs match your search.'}
            </p>
            {isAuthenticated && user?.role === 'Employer' && (
              <Link href="/jobs/post" className="text-xs text-mauve hover:text-gc-bright transition-colors">
                Post the first job →
              </Link>
            )}
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((job, i) => (
            <div key={job.id}
              className="rounded-2xl border border-royal bg-deep/50 p-6
                         hover:border-mauve/35 hover:-translate-y-0.5
                         hover:shadow-[0_8px_32px_rgba(255,79,0,0.12)]
                         transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i*60}ms` }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-cream text-[17px] tracking-tight mb-1">{job.title}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-blush/80">{job.company}</span>
                    <span className="text-blush/30">·</span>
                    <span className="text-blush/50">{job.location}</span>
                    <span className="text-blush/30">·</span>
                    <span className="text-blush/35 text-xs">{timeAgo(job.postedAt)}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-grad-btn
                                flex items-center justify-center text-cream font-bold text-[15px] shadow-royal">
                  {job.company[0]}
                </div>
              </div>
              <p className="text-blush/45 text-sm leading-relaxed mb-4 line-clamp-2">{job.description}</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2 flex-wrap">
                  {job.requiredSkills.map(skill => (
                    <span key={skill}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full
                                 bg-royal/40 text-blush/60 border border-royal">
                      {skill}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setApplyJob(job)}
                  className="text-xs font-semibold px-5 py-2 rounded-xl bg-grad-btn
                             text-cream shadow-royal shadow-btn-inset hover:shadow-mauve
                             hover:-translate-y-px transition-all flex-shrink-0">
                  Apply →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
