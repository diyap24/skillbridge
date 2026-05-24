'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const profileSchema  = z.object({ fullName: z.string().min(2, 'Name required') });
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword:     z.string().min(8, 'Min 8 characters'),
});
type PF  = z.infer<typeof profileSchema>;
type PwF = z.infer<typeof passwordSchema>;

const INPUT = `w-full bg-void/60 border border-royal rounded-xl px-4 py-2.5 text-sm text-cream
  placeholder-blush/25 focus:outline-none focus:border-mauve/50 focus:ring-2 focus:ring-mauve/10 transition-all`;

const NAV_ITEMS = ['Profile','Account','Notifications','Security','Privacy','API tokens'];

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
                  ${on ? 'bg-mauve' : 'bg-royal'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
                        ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const { user, isAuthenticated, setAuth, accessToken, refreshToken } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Profile');
  const [prefs, setPrefs] = useState({ publicProfile: true, emailDigests: false, twoFactor: true });

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
    <div className="min-h-screen bg-void pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8 animate-fade-up">
          <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-2">Account</p>
          <h1 className="text-[36px] font-semibold text-cream tracking-tight mb-1">Settings</h1>
          <p className="text-blush/35 text-sm">Manage your account, preferences, and security</p>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] gap-6 animate-fade-up [animation-delay:80ms]">

          {/* Left sidebar nav */}
          <div className="space-y-1">
            {NAV_ITEMS.map(item => (
              <button key={item} onClick={() => setActiveTab(item)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${activeTab === item
                    ? 'bg-mauve/15 text-mauve border border-mauve/25'
                    : 'text-blush/50 hover:text-cream hover:bg-royal/30 border border-transparent'}`}>
                {item}
              </button>
            ))}
            <div className="pt-2 border-t border-royal mt-2">
              <button onClick={() => toast.error('Contact support to delete your account.')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-mauve/70
                           hover:bg-mauve/10 hover:text-mauve transition-all border border-transparent">
                Delete account
              </button>
            </div>
          </div>

          {/* Right content */}
          <div className="space-y-5">
            {/* Public profile form */}
            <div className="rounded-2xl border border-royal bg-deep/50 p-7">
              <h2 className="font-semibold text-cream text-[15px] mb-1">Public profile</h2>
              <p className="text-blush/35 text-xs mb-6">This is what employers see when they verify your credentials.</p>

              {/* Avatar row */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-grad-btn flex items-center justify-center
                                text-cream text-lg font-bold shadow-royal flex-shrink-0">
                  {user?.fullName?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
                </div>
                <div>
                  <button className="px-4 py-2 rounded-xl border border-royal text-blush/50 text-xs font-semibold
                                     hover:border-mauve/30 hover:text-blush transition-all mb-1">
                    Upload photo
                  </button>
                  <p className="text-[10px] text-blush/25">JPG or PNG. Max 2 MB.</p>
                </div>
              </div>

              <form onSubmit={pf.handleSubmit(onProfile)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">
                      First name
                    </label>
                    <input {...pf.register('fullName')} placeholder="Jane"
                      className={INPUT} />
                    {pf.formState.errors.fullName && (
                      <p className="text-mauve text-xs mt-1">{pf.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">
                      Last name
                    </label>
                    <input placeholder="Smith" disabled className={INPUT+' opacity-40 cursor-not-allowed'} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">
                    Headline
                  </label>
                  <input placeholder="Full-stack engineer · Remote · India" className={INPUT} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">
                    Bio
                  </label>
                  <textarea rows={3} placeholder="Tell employers about yourself..."
                    className={INPUT + ' resize-none'} />
                </div>
              </form>
            </div>

            {/* Preferences */}
            <div className="rounded-2xl border border-royal bg-deep/50 p-7">
              <h2 className="font-semibold text-cream text-[15px] mb-6">Preferences</h2>
              <div className="space-y-5">
                {[
                  { key:'publicProfile', label:'Public profile',   desc:'Allow employers to find your profile via search' },
                  { key:'emailDigests',  label:'Email digests',    desc:'Weekly summary of new jobs matching your skills' },
                  { key:'twoFactor',     label:'Two-factor auth',  desc:'Require a code from your authenticator app at sign-in' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-cream">{label}</p>
                      <p className="text-[11px] text-blush/35 mt-0.5">{desc}</p>
                    </div>
                    <Toggle
                      on={prefs[key as keyof typeof prefs]}
                      onChange={v => setPrefs(p => ({ ...p, [key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password */}
            <div className="rounded-2xl border border-royal bg-deep/50 p-7">
              <h2 className="font-semibold text-cream text-[15px] mb-5">Change Password</h2>
              <form onSubmit={pwf.handleSubmit(onPassword)} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">
                    Current password
                  </label>
                  <input {...pwf.register('currentPassword')} type="password" placeholder="••••••••" className={INPUT} />
                  {pwf.formState.errors.currentPassword && (
                    <p className="text-mauve text-xs mt-1">{pwf.formState.errors.currentPassword.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">
                    New password
                  </label>
                  <input {...pwf.register('newPassword')} type="password" placeholder="8+ characters" className={INPUT} />
                  {pwf.formState.errors.newPassword && (
                    <p className="text-mauve text-xs mt-1">{pwf.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => pwf.reset()}
                    className="px-5 py-2.5 rounded-xl border border-royal text-blush/50 text-sm font-semibold
                               hover:border-mauve/30 hover:text-blush transition-all">
                    Discard
                  </button>
                  <button type="submit" disabled={pwf.formState.isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-grad-btn text-cream font-semibold text-sm
                               shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px
                               transition-all disabled:opacity-50">
                    {pwf.formState.isSubmitting ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Profile save button */}
            <div className="flex justify-end gap-3">
              <button className="px-5 py-2.5 rounded-xl border border-royal text-blush/50 text-sm font-semibold
                                 hover:border-mauve/30 hover:text-blush transition-all">
                Discard
              </button>
              <button onClick={pf.handleSubmit(onProfile)} disabled={pf.formState.isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-grad-btn text-cream font-semibold text-sm
                           shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px
                           transition-all disabled:opacity-50">
                {pf.formState.isSubmitting ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
