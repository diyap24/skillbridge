'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

const schema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
  role:     z.enum(['Candidate', 'Employer']),
});
type F = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<F>({ resolver: zodResolver(schema), defaultValues: { role: 'Candidate' } });

  const onSubmit = async (data: F) => {
    try {
      const res = await api.post('/auth/register', data);
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      router.push('/dashboard');
    } catch {
      setError('root', { message: 'Registration failed. Try again.' });
    }
  };

  const inputCls = `w-full bg-void/50 border border-royal/30 rounded-xl px-4 py-3
    text-sm text-cream placeholder-blush/25
    focus:outline-none focus:border-mauve/60 focus:bg-void/70
    focus:ring-2 focus:ring-mauve/15 transition-all duration-200`;

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-royal/25 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-deep/50 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative w-full max-w-sm animate-fade-up">

        <div className="text-center mb-8">
          <Link href="/"
            className="inline-flex w-12 h-12 rounded-2xl bg-grad-btn items-center justify-center
                       shadow-royal hover:shadow-mauve hover:-translate-y-0.5
                       transition-all duration-200 mb-6">
            <span className="text-cream text-xs font-black">SB</span>
          </Link>
          <h1 className="text-2xl font-black text-cream tracking-tight mb-1.5">
            Create your account
          </h1>
          <p className="text-blush/45 text-sm">Free forever. No credit card needed.</p>
        </div>

        <div className="rounded-2xl border border-royal/25 bg-deep/35 backdrop-blur-md p-7
                        shadow-xl shadow-void/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-2">
                Full name
              </label>
              <input {...register('fullName')} placeholder="Jane Smith" className={inputCls} />
              {errors.fullName && <p className="text-mauve/80 text-xs mt-1.5">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-2">
                Email
              </label>
              <input {...register('email')} type="email" placeholder="you@example.com" className={inputCls} />
              {errors.email && <p className="text-mauve/80 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-2">
                Password
              </label>
              <input {...register('password')} type="password" placeholder="8+ characters" className={inputCls} />
              {errors.password && <p className="text-mauve/80 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-3">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Candidate', 'Employer'] as const).map((role) => (
                  <label key={role}
                    className="relative flex items-center gap-2.5 rounded-xl border
                               border-royal/25 bg-void/40 px-4 py-3 cursor-pointer
                               hover:border-mauve/40 hover:bg-royal/10
                               transition-all duration-200 has-[:checked]:border-mauve/50
                               has-[:checked]:bg-royal/20">
                    <input {...register('role')} type="radio" value={role}
                      className="w-3.5 h-3.5 accent-mauve" />
                    <span className="text-sm font-semibold text-blush/70
                                     has-[:checked]:text-cream">
                      {role}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {errors.root && (
              <div className="rounded-xl border border-mauve/20 bg-mauve/8 px-4 py-3">
                <p className="text-blush text-sm">{errors.root.message}</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full mt-1 py-3.5 rounded-xl bg-grad-btn text-cream font-semibold
                         text-sm shadow-royal hover:shadow-mauve hover:-translate-y-px
                         transition-all duration-200 disabled:opacity-50
                         disabled:cursor-not-allowed disabled:translate-y-0">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-cream/25 border-t-cream rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-blush/35 mt-5">
          Already have an account?{' '}
          <Link href="/login"
            className="text-blush/70 hover:text-cream font-semibold transition-colors duration-200">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
