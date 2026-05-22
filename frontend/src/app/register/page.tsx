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
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { role: 'Candidate' } });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/register', data);
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      router.push('/dashboard');
    } catch {
      setError('root', { message: 'Registration failed. Try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-royal/25 top-[-50px] right-[-50px]" />
      <div className="orb w-80 h-80 bg-deep/50 bottom-[-50px] left-[-50px]" />

      <div className="relative z-10 w-full max-w-md animate-fade-up">

        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14
                                     rounded-2xl bg-gradient-to-br from-royal to-mauve
                                     shadow-2xl shadow-royal/50 mb-6
                                     hover:scale-110 transition-transform duration-300">
            <span className="text-cream text-xl font-black">S</span>
          </Link>
          <h1 className="text-3xl font-black text-cream mb-2">Create your account</h1>
          <p className="text-blush/50 text-sm">Free forever. No credit card needed.</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl shadow-void/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
              <label className="block text-xs font-semibold text-blush/70 uppercase tracking-widest mb-2">
                Full name
              </label>
              <input {...register('fullName')} placeholder="Jane Smith" className="input-field" />
              {errors.fullName && <p className="text-mauve text-xs mt-1.5">⚠ {errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-blush/70 uppercase tracking-widest mb-2">
                Email
              </label>
              <input {...register('email')} type="email" placeholder="you@example.com" className="input-field" />
              {errors.email && <p className="text-mauve text-xs mt-1.5">⚠ {errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-blush/70 uppercase tracking-widest mb-2">
                Password
              </label>
              <input {...register('password')} type="password" placeholder="8+ characters" className="input-field" />
              {errors.password && <p className="text-mauve text-xs mt-1.5">⚠ {errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-blush/70 uppercase tracking-widest mb-3">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Candidate', 'Employer'] as const).map((role) => (
                  <label key={role}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer
                               transition-all duration-200 border
                               ${selectedRole === role
                                 ? 'bg-royal/30 border-mauve/50 shadow-inner'
                                 : 'border-royal/20 hover:border-royal/40 hover:bg-royal/10'}`}>
                    <input {...register('role')} type="radio" value={role} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                    transition-all duration-200
                                    ${selectedRole === role
                                      ? 'border-mauve bg-mauve'
                                      : 'border-royal/40'}`}>
                      {selectedRole === role && (
                        <div className="w-1.5 h-1.5 rounded-full bg-cream" />
                      )}
                    </div>
                    <span className={`text-sm font-semibold transition-colors duration-200
                                     ${selectedRole === role ? 'text-cream' : 'text-blush/60'}`}>
                      {role}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {errors.root && (
              <div className="bg-mauve/10 border border-mauve/20 rounded-xl px-4 py-3">
                <p className="text-blush text-sm">✕ {errors.root.message}</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="btn-primary w-full py-3.5 text-sm mt-2">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-cream/20 border-t-cream rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create account →'}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-blush/40 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blush/70 hover:text-cream font-semibold transition-colors duration-200">
            Sign in →
          </Link>
        </p>

      </div>
    </div>
  );
}
