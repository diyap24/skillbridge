'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type F = z.infer<typeof schema>;

const INPUT = `w-full bg-void/60 border border-royal rounded-xl px-4 py-3 text-sm text-cream
  placeholder-blush/25 focus:outline-none focus:border-mauve/50 focus:ring-2 focus:ring-mauve/10 transition-all`;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: F) => {
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      router.push('/dashboard');
    } catch {
      setError('root', { message: 'Invalid email or password' });
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 pt-20 relative overflow-hidden">
      {/* Orange halo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]
                        rounded-full blur-[80px] opacity-25"
             style={{ background:'radial-gradient(ellipse, rgba(255,79,0,0.6) 0%, transparent 65%)' }} />
      </div>

      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <Link href="/"
            className="inline-flex w-12 h-12 rounded-2xl bg-grad-btn items-center justify-center
                       shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-0.5
                       transition-all duration-200 mb-6">
            <span className="text-cream text-xs font-bold">SB</span>
          </Link>
          <h1 className="text-2xl font-semibold text-cream tracking-tight mb-1.5">Welcome back</h1>
          <p className="text-blush/40 text-sm">Sign in to your account</p>
        </div>

        <div className="rounded-2xl border border-royal bg-deep/60 backdrop-blur-md p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">Email</label>
              <input {...register('email')} type="email" placeholder="you@example.com" className={INPUT} />
              {errors.email && <p className="text-mauve text-xs mt-1.5">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">Password</label>
              <input {...register('password')} type="password" placeholder="••••••••" className={INPUT} />
              {errors.password && <p className="text-mauve text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            {errors.root && (
              <div className="rounded-xl border border-mauve/20 bg-mauve/8 px-4 py-3">
                <p className="text-blush text-sm">{errors.root.message}</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full mt-1 py-3.5 rounded-xl bg-grad-btn text-cream font-semibold text-sm
                         shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px
                         transition-all duration-200 active:translate-y-0
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-cream/25 border-t-cream rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-blush/30 mt-5">
          No account?{' '}
          <Link href="/register" className="text-blush/60 hover:text-cream font-semibold transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
