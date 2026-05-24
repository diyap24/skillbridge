'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const profileSchema  = z.object({ fullName: z.string().min(2, 'Name required') });
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword:     z.string().min(8, 'Min 8 characters'),
});
type PF = z.infer<typeof profileSchema>;
type PwF = z.infer<typeof passwordSchema>;

const inputCls = `w-full bg-void/50 border border-royal/30 rounded-xl px-4 py-3 text-sm text-cream
  placeholder-blush/25 focus:outline-none focus:border-mauve/60 focus:ring-2 focus:ring-mauve/15 transition-all`;

export default function SettingsPage() {
  const { user, isAuthenticated, setAuth, accessToken, refreshToken } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.push('/login'); }, [isAuthenticated, router]);

  const pf  = useForm<PF>({ resolver: zodResolver(profileSchema), defaultValues: { fullName: user?.fullName||'' } });
  const pwf = useForm<PwF>({ resolver: zodResolver(passwordSchema) });

  const onProfile = async (data: PF) => {
    try {
      const res = await api.put('/auth/me', data);
      if (user && accessToken && refreshToken)
        setAuth({ ...user, fullName: res.data.fullName }, accessToken, refreshToken);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update.'); }
  };

  const onPassword = async (data: PwF) => {
    try {
      await api.post('/auth/change-password', data);
      toast.success('Password updated!');
      pwf.reset();
    } catch (err: unknown) {
      const msg = (err as {response?:{data?:{message?:string}}})?.response?.data?.message || 'Failed.';
      toast.error(msg);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-void pt-24 pb-20 px-6 relative">
      <div className="relative max-w-2xl mx-auto">
        <div className="mb-8 animate-fade-up">
          <Link href="/profile" className="text-blush/40 hover:text-blush text-sm transition-colors mb-4 inline-block">← Back</Link>
          <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-2">Account</p>
          <h1 className="text-4xl font-black text-cream tracking-tight">Settings</h1>
        </div>

        <div className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-7 mb-5 animate-fade-up">
          <h2 className="font-bold text-cream text-[15px] mb-5">Profile Information</h2>
          <form onSubmit={pf.handleSubmit(onProfile)} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-2">Full name</label>
              <input {...pf.register('fullName')} className={inputCls} />
              {pf.formState.errors.fullName && <p className="text-mauve/80 text-xs mt-1.5">{pf.formState.errors.fullName.message}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-2">Email</label>
              <input value={user?.email} disabled className={inputCls+' opacity-40 cursor-not-allowed'} />
              <p className="text-blush/25 text-xs mt-1.5">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-2">Role</label>
              <input value={user?.role} disabled className={inputCls+' opacity-40 cursor-not-allowed'} />
            </div>
            <button type="submit" disabled={pf.formState.isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-royal to-mauve text-cream
                         font-semibold text-sm shadow-royal hover:shadow-mauve hover:-translate-y-px transition-all disabled:opacity-50">
              {pf.formState.isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-royal/20 bg-deep/25 backdrop-blur-sm p-7 mb-5 animate-fade-up [animation-delay:80ms]">
          <h2 className="font-bold text-cream text-[15px] mb-5">Change Password</h2>
          <form onSubmit={pwf.handleSubmit(onPassword)} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-2">Current password</label>
              <input {...pwf.register('currentPassword')} type="password" placeholder="••••••••" className={inputCls} />
              {pwf.formState.errors.currentPassword && <p className="text-mauve/80 text-xs mt-1.5">{pwf.formState.errors.currentPassword.message}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-blush/50 uppercase tracking-[0.12em] mb-2">New password</label>
              <input {...pwf.register('newPassword')} type="password" placeholder="8+ characters" className={inputCls} />
              {pwf.formState.errors.newPassword && <p className="text-mauve/80 text-xs mt-1.5">{pwf.formState.errors.newPassword.message}</p>}
            </div>
            <button type="submit" disabled={pwf.formState.isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-royal to-mauve text-cream
                         font-semibold text-sm shadow-royal hover:shadow-mauve hover:-translate-y-px transition-all disabled:opacity-50">
              {pwf.formState.isSubmitting ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-red-900/30 bg-red-950/10 p-7 animate-fade-up [animation-delay:160ms]">
          <h2 className="font-bold text-red-400 text-[15px] mb-2">Danger Zone</h2>
          <p className="text-blush/30 text-xs mb-4">Once deleted, your account cannot be recovered.</p>
          <button onClick={() => toast.error('Contact support to delete your account.')}
            className="px-6 py-2.5 rounded-xl border border-red-900/40 text-red-400/70 font-semibold text-sm
                       hover:bg-red-950/30 hover:text-red-400 hover:border-red-800/50 transition-all">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
