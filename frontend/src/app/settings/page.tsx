'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const schema = z.object({
  fullName:        z.string().min(2, 'Name required'),
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword:     z.string().min(8, 'Min 8 characters').or(z.literal('')),
});
type F = z.infer<typeof schema>;

const inputCls = `w-full bg-void/50 border border-royal/30 rounded-xl px-4 py-3
  text-sm text-cream placeholder-blush/25
  focus:outline-none focus:border-mauve/60 focus:ring-2 focus:ring-mauve/15
  transition-all duration-200`;

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.push('/login'); }, [isAuthenticated, router]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<F>({
      resolver: zodResolver(schema),
      defaultValues: { fullName: user?.fullName || '', currentPassword: '', newPassword: '' },
    });

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 800));
    toast.success('Settings saved!');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-void pt-24 pb-20 px-6 relative">
      <div className="relative max-w-2xl mx-auto">

        <div className="mb-8 animate-fade-up">
          <Link href="/profile"
            className="text-blush/40 hover:text-blush text-sm transition-colors mb-4 inline-block">
            ← Back to profile
          </Link>
          <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-2">
            Account
          </p>
          <h1 className="text-4xl font-black text-cream tracking-tight">Settings</h1>
        </div>

        {/* Profile info */}
        <div className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-7 mb-5
                        animate-fade-up [animation-delay:80ms]">
          <h2 className="font-bold text-cream text-[15px] mb-5">Profile Information</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="block text-[11px] font-semibold text-blush/50
                                uppercase tracking-[0.12em] mb-2">
                Full name
              </label>
              <input {...register('fullName')} className={inputCls} />
              {errors.fullName && (
                <p className="text-mauve/80 text-xs mt-1.5">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-blush/50
                                uppercase tracking-[0.12em] mb-2">
                Email
              </label>
              <input value={user?.email} disabled
                className={`${inputCls} opacity-40 cursor-not-allowed`} />
              <p className="text-blush/25 text-xs mt-1.5">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-blush/50
                                uppercase tracking-[0.12em] mb-2">
                Role
              </label>
              <input value={user?.role} disabled
                className={`${inputCls} opacity-40 cursor-not-allowed`} />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-royal to-mauve
                         text-cream font-semibold text-sm shadow-royal hover:shadow-mauve
                         hover:-translate-y-px transition-all disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>

          </form>
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-7 mb-5
                        animate-fade-up [animation-delay:160ms]">
          <h2 className="font-bold text-cream text-[15px] mb-5">Change Password</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="block text-[11px] font-semibold text-blush/50
                                uppercase tracking-[0.12em] mb-2">
                Current password
              </label>
              <input {...register('currentPassword')} type="password"
                placeholder="••••••••" className={inputCls} />
              {errors.currentPassword && (
                <p className="text-mauve/80 text-xs mt-1.5">{errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-blush/50
                                uppercase tracking-[0.12em] mb-2">
                New password
              </label>
              <input {...register('newPassword')} type="password"
                placeholder="8+ characters" className={inputCls} />
              {errors.newPassword && (
                <p className="text-mauve/80 text-xs mt-1.5">{errors.newPassword.message}</p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-royal to-mauve
                         text-cream font-semibold text-sm shadow-royal hover:shadow-mauve
                         hover:-translate-y-px transition-all disabled:opacity-50">
              {isSubmitting ? 'Updating...' : 'Update password'}
            </button>

          </form>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-red-900/30 bg-red-950/10 backdrop-blur-sm p-7
                        animate-fade-up [animation-delay:240ms]">
          <h2 className="font-bold text-red-400 text-[15px] mb-2">Danger Zone</h2>
          <p className="text-blush/30 text-xs mb-4">
            Once you delete your account, there is no going back.
          </p>
          <button
            onClick={() => toast.error('Please contact support to delete your account.')}
            className="px-6 py-2.5 rounded-xl border border-red-900/40 text-red-400/70
                       font-semibold text-sm hover:bg-red-950/30 hover:text-red-400
                       hover:border-red-800/50 transition-all duration-200">
            Delete account
          </button>
        </div>

      </div>
    </div>
  );
}
