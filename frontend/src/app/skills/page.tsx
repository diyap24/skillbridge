'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import type { Skill } from '@/types';

export default function SkillsPage() {
  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: () => api.get('/skills').then((r) => r.data),
  });
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div className="min-h-screen bg-void pt-24 pb-20 px-6 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-deep/40 blur-[100px] rounded-full -translate-x-1/3 -translate-y-1/3" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-10 animate-fade-up">
          <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-2">
            All skills
          </p>
          <h1 className="text-4xl font-black text-cream tracking-tight mb-1">Skills</h1>
          <p className="text-blush/40 text-sm">Browse all verifiable skills on SkillBridge</p>
        </div>

        {isLoading && (
          <div className="grid md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-deep/20 animate-fade-in" />
            ))}
          </div>
        )}

        {categories.map((cat, ci) => (
          <div key={cat} className="mb-10 animate-fade-up"
               style={{ animationDelay: `${ci * 80}ms` }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-bold text-blush/50 uppercase tracking-[0.15em]">
                {cat}
              </span>
              <div className="flex-1 h-px bg-royal/15" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.filter((s) => s.category === cat).map((skill, i) => (
                <Link key={skill.id} href={`/challenges?skill=${skill.slug}`}
                  className="group flex items-center justify-between rounded-xl
                             border border-royal/20 bg-deep/20 px-5 py-4
                             hover:border-mauve/35 hover:bg-deep/35 hover:-translate-y-0.5
                             transition-all duration-200 animate-fade-up"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div>
                    <p className="font-semibold text-cream text-sm tracking-tight
                                  group-hover:text-blush transition-colors duration-200">
                      {skill.name}
                    </p>
                    <p className="text-[11px] text-blush/30 mt-0.5">{skill.description}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className="text-mauve/30 group-hover:text-mauve/70 -translate-x-1
                               group-hover:translate-x-0 transition-all duration-200 flex-shrink-0">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
