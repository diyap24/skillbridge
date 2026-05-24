'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const schema = z.object({
  title:       z.string().min(3, 'Title required'),
  company:     z.string().min(2, 'Company required'),
  location:    z.string().min(2, 'Location required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
});
type F = z.infer<typeof schema>;
const SKILLS = ['Python','React','C#','TypeScript','SQL','Docker','JavaScript','Java','Go','Rust'];
const inputCls = `w-full bg-void/50 border border-royal/30 rounded-xl px-4 py-3 text-sm text-cream
  placeholder-blush/25 focus:outline-none focus:border-mauve/60 focus:ring-2 focus:ring-mauve/15 transition-all`;

export default function PostJobPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    if (user?.role === 'Candidate') router.push('/dashboard');
  }, [isAuthenticated, user, router]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<F>({ resolver: zodResolver(schema) });

  const toggleSkill = (skill: string) =>
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s=>s!==skill) : [...prev, skill]);

  const onSubmit = async (data: F) => {
    if (selectedSkills.length === 0) { toast.error('Select at least one skill'); return; }
    try {
      await api.post('/jobs', { ...data, requiredSkills: selectedSkills });
      toast.success('Job posted!');
      router.push('/jobs');
    } catch { toast.error('Failed to post job.'); }
  };

  return (
    <div className="min-h-screen bg-void pt-24 pb-20 px-6 relative">
      <div className="relative max-w-2xl mx-auto">
        <div className="mb-8 animate-fade-up">
          <Link href="/jobs" className="text-blush/40 hover:text-blush text-sm transition-colors mb-4 inline-block">
            ← Back to jobs
          </Link>
          <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-2">Employer</p>
          <h1 className="text-4xl font-black text-cream tracking-tight">Post a Job</h1>
        </div>
        <div className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-7 animate-fade-up [animation-delay:80ms]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {[
              { name: 'title' as const, label: 'Job Title', placeholder: 'Senior React Developer' },
              { name: 'company' as const, label: 'Company', placeholder: 'Acme Corp' },
              { name: 'location' as const, label: 'Location', placeholder: 'New York / Remote' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-2">{f.label}</label>
                <input {...register(f.name)} placeholder={f.placeholder} className={inputCls} />
                {errors[f.name] && <p className="text-mauve/80 text-xs mt-1.5">{errors[f.name]?.message}</p>}
              </div>
            ))}
            <div>
              <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-2">Description</label>
              <textarea {...register('description')} rows={5} placeholder="Describe the role..." className={inputCls+' resize-none'} />
              {errors.description && <p className="text-mauve/80 text-xs mt-1.5">{errors.description.message}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-3">Required Skills</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(skill => (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedSkills.includes(skill)
                        ? 'bg-gradient-to-r from-royal to-mauve text-cream border-transparent shadow-royal'
                        : 'border-royal/25 text-blush/50 hover:border-royal/50'}`}>
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-royal to-mauve text-cream
                         font-semibold text-sm shadow-royal hover:shadow-mauve hover:-translate-y-px transition-all disabled:opacity-50">
              {isSubmitting ? 'Posting...' : 'Post Job →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
