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
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      router.push('/dashboard');
    } catch {
      setError('root', { message: 'Invalid email or password' });
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-deep/60 top-0 left-[-100px]" />
      <div className="orb w-80 h-80 bg-royal/30 bottom-0 right-[-80px]" />

      <div className="relative z-10 w-full max-w-md animate-fade-up">

        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14
                                     rounded-2xl bg-gradient-to-br from-royal to-mauve
                                     shadow-2xl shadow-royal/50 mb-6
                                     hover:scale-110 transition-transform duration-300">
            <span className="text-cream text-xl font-black">S</span>
          </Link>
          <h1 className="text-3xl font-black text-cream mb-2">Welcome back</h1>
          <p className="text-blush/50 text-sm">Sign in to your SkillBridge account</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl shadow-void/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
              <label className="block text-xs font-semibold text-blush/70 uppercase
                                tracking-widest mb-2">
                Email
              </label>
              <input {...register('email')} type="email"
                placeholder="you@example.com" className="input-field" />
              {errors.email && (
                <p className="text-mauve text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-blush/70 uppercase
                                tracking-widest mb-2">
                Password
              </label>
              <input {...register('password')} type="password"
                placeholder="••••••••" className="input-field" />
              {errors.password && (
                <p className="text-mauve text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {errors.root && (
              <div className="bg-mauve/10 border border-mauve/20 rounded-xl px-4 py-3">
                <p className="text-blush text-sm flex items-center gap-2">
                  <span>✕</span> {errors.root.message}
                </p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="btn-primary w-full py-3.5 text-sm mt-2">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-cream/20 border-t-cream
                                   rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign in →'}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-blush/40 mt-6">
          No account?{' '}
          <Link href="/register"
            className="text-blush/70 hover:text-cream font-semibold
                       transition-colors duration-200">
            Create one free →
          </Link>
        </p>

      </div>
    </div>
  );
}
