'use client';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import Link from 'next/link';
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

export default function JobsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [search, setSearch] = useState('');

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
    <div className="min-h-screen bg-void pt-24 pb-20 px-6 relative">
      <div className="relative max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-8 animate-fade-up">
          <div>
            <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-2">Opportunities</p>
            <h1 className="text-4xl font-black text-cream tracking-tight mb-1">Job Board</h1>
            <p className="text-blush/40 text-sm">Jobs matched to your verified skills</p>
          </div>
          {isAuthenticated && user?.role === 'Employer' && (
            <Link href="/jobs/post"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-royal to-mauve text-cream
                         font-semibold text-sm shadow-royal hover:shadow-mauve hover:-translate-y-px transition-all">
              Post a Job +
            </Link>
          )}
        </div>

        <div className="relative mb-6 animate-fade-up [animation-delay:80ms]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blush/30"
               width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company, or skill..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-deep/30 border border-royal/20
                       text-sm text-cream placeholder-blush/25 backdrop-blur-sm
                       focus:outline-none focus:border-mauve/50 focus:ring-2 focus:ring-mauve/10 transition-all" />
        </div>

        {isLoading && <div className="space-y-4">{Array.from({length:3}).map((_,i)=><CardSkeleton key={i}/>)}</div>}

        {!isLoading && filtered.length === 0 && (
          <div className="rounded-2xl border border-royal/20 bg-deep/20 p-16 text-center">
            <div className="text-5xl mb-4">💼</div>
            <p className="text-blush/40 text-sm mb-2">
              {jobs.length === 0 ? 'No jobs posted yet.' : 'No jobs match your search.'}
            </p>
            {isAuthenticated && user?.role === 'Employer' && (
              <Link href="/jobs/post" className="text-xs text-mauve hover:text-blush transition-colors">
                Post the first job →
              </Link>
            )}
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((job, i) => (
            <div key={job.id}
              className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-6
                         hover:border-mauve/35 hover:-translate-y-0.5
                         hover:shadow-[0_8px_32px_rgba(82,43,91,0.25)]
                         transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i*60}ms` }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-cream text-lg tracking-tight mb-1">{job.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-blush/50">
                    <span className="font-semibold text-blush/70">{job.company}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                    <span>·</span>
                    <span className="text-xs">{new Date(job.postedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-royal to-mauve
                                flex items-center justify-center text-cream font-black text-lg shadow-royal">
                  {job.company[0]}
                </div>
              </div>
              <p className="text-blush/50 text-sm leading-relaxed mb-4 line-clamp-2">{job.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {job.requiredSkills.map(skill => (
                    <span key={skill}
                      className="text-[11px] font-semibold px-3 py-1 rounded-full
                                 bg-royal/20 text-blush/70 border border-royal/30">
                      {skill}
                    </span>
                  ))}
                </div>
                <button onClick={() => alert('Apply feature coming soon!')}
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-royal to-mauve
                             text-cream shadow-royal hover:shadow-mauve hover:-translate-y-px transition-all flex-shrink-0 ml-3">
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
