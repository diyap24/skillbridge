'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import type { Skill } from '@/types';

const CAT: Record<string, string> = {
  Frontend: 'bg-mauve/20 text-blush border border-mauve/30',
  Backend:  'bg-royal/25 text-cream border border-royal/40',
  Database: 'bg-deep/50 text-blush/80 border border-deep/80',
  DevOps:   'bg-void/70 text-cream border border-mauve/20',
};

export default function SkillsPage() {
  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: () => api.get('/skills').then((r) => r.data),
  });
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div className="min-h-screen bg-void pt-28 pb-20 px-6 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-deep/40 top-0 left-0" />
      <div className="orb w-64 h-64 bg-royal/20 bottom-20 right-10" />

      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="mb-10 animate-fade-up">
          <p className="text-mauve text-xs font-semibold uppercase tracking-widest mb-2">
            All skills
          </p>
          <h1 className="text-4xl font-black text-cream">Skills</h1>
          <p className="text-blush/50 mt-1 text-sm">
            Browse all verifiable skills on SkillBridge
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shimmer-card h-24" />
            ))}
          </div>
        )}

        {categories.map((cat, ci) => (
          <div key={cat} className="mb-10 animate-fade-up"
               style={{ animationDelay: `${ci * 0.1}s` }}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full
                               ${CAT[cat] ?? 'bg-royal/20 text-cream border border-royal/30'}`}>
                {cat}
              </span>
              <div className="flex-1 h-px bg-royal/15" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.filter((s) => s.category === cat).map((skill, i) => (
                <Link key={skill.id}
                  href={`/challenges?skill=${skill.slug}`}
                  className="card group animate-fade-up"
                  style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-cream text-sm
                                  group-hover:text-blush transition-colors duration-200">
                      {skill.name}
                    </p>
                    <span className="text-mauve/50 text-sm opacity-0 group-hover:opacity-100
                                     translate-x-[-4px] group-hover:translate-x-0
                                     transition-all duration-300">
                      →
                    </span>
                  </div>
                  <p className="text-xs text-blush/30 mt-1">{skill.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
