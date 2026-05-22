'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import type { Skill } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'bg-blue-100 text-blue-700',
  Backend:  'bg-green-100 text-green-700',
  Database: 'bg-yellow-100 text-yellow-700',
  DevOps:   'bg-purple-100 text-purple-700',
};

export default function SkillsPage() {
  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: () => api.get('/skills').then((r) => r.data),
  });

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Skills</h1>
        <p className="text-slate-500">
          Browse all verifiable skills on SkillBridge
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-2 w-2/3" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-3">{cat}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills
              .filter((s) => s.category === cat)
              .map((skill) => (
                <Link
                  key={skill.id}
                  href={`/challenges?skill=${skill.slug}`}
                  className="bg-white border border-slate-200 rounded-xl p-4
                             hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900 text-sm">
                      {skill.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${CATEGORY_COLORS[skill.category] ?? 'bg-slate-100 text-slate-600'}`}>
                      {skill.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{skill.description}</p>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
