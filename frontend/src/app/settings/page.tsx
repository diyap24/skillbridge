'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useRef, useState } from 'react';
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

  // ── API tokens ─────────────────────────────────────────────────────────────
  interface ApiToken { id: string; name: string; preview: string; createdAt: string; }
  const [tokens, setTokens]             = useState<ApiToken[]>([]);
  const [newTokenName, setNewTokenName] = useState('');
  const [revealed, setRevealed]         = useState<{ id: string; full: string } | null>(null);

  useEffect(() => {
    try { setTokens(JSON.parse(localStorage.getItem('sb_api_tokens') || '[]')); } catch { /* ignore */ }
  }, []);

  const saveTokens = (list: ApiToken[]) => {
    setTokens(list);
    localStorage.setItem('sb_api_tokens', JSON.stringify(list));
  };

  const generateToken = () => {
    if (!newTokenName.trim()) { toast.error('Enter a token name first'); return; }
    const raw  = 'sk_live_' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
                   .map(b => b.toString(16).padStart(2,'0')).join('');
    const token: ApiToken = {
      id:        crypto.randomUUID(),
      name:      newTokenName.trim(),
      preview:   raw.slice(0, 14) + '…' + raw.slice(-4),
      createdAt: new Date().toISOString(),
    };
    saveTokens([token, ...tokens]);
    setRevealed({ id: token.id, full: raw });
    setNewTokenName('');
    toast.success('Token generated — copy it now, it won\'t be shown again.');
  };

  const revokeToken = (id: string) => {
    saveTokens(tokens.filter(t => t.id !== id));
    if (revealed?.id === id) setRevealed(null);
    toast.success('Token revoked');
  };

  const copyToken = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sb_avatar');
    if (saved) setAvatarUrl(saved);
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2 MB'); return; }
    if (!file.type.startsWith('image/')) { toast.error('Please select a JPG or PNG'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setAvatarUrl(url);
      localStorage.setItem('sb_avatar', url);
      toast.success('Photo updated!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

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

          {/* Right content — rendered per active tab */}
          <div className="space-y-5">

            {/* ── Profile ── */}
            {activeTab === 'Profile' && (
              <>
                <div className="rounded-2xl border border-royal bg-deep/50 p-7">
                  <h2 className="font-semibold text-cream text-[15px] mb-1">Public profile</h2>
                  <p className="text-blush/35 text-xs mb-6">This is what employers see when they verify your credentials.</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-grad-btn flex items-center justify-center
                                    text-cream text-lg font-bold shadow-royal flex-shrink-0 overflow-hidden">
                      {avatarUrl
                        ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        : user?.fullName?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handlePhotoSelect}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl border border-royal text-blush/50 text-xs font-semibold
                                   hover:border-mauve/30 hover:text-blush transition-all mb-1">
                        Upload photo
                      </button>
                      {avatarUrl && (
                        <button
                          onClick={() => { setAvatarUrl(null); localStorage.removeItem('sb_avatar'); toast.success('Photo removed'); }}
                          className="ml-2 px-3 py-2 rounded-xl text-blush/30 text-xs hover:text-red-400 transition-colors">
                          Remove
                        </button>
                      )}
                      <p className="text-[10px] text-blush/25 mt-1">JPG or PNG. Max 2 MB.</p>
                    </div>
                  </div>
                  <form onSubmit={pf.handleSubmit(onProfile)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">First name</label>
                        <input {...pf.register('fullName')} placeholder="Jane" className={INPUT} />
                        {pf.formState.errors.fullName && (
                          <p className="text-mauve text-xs mt-1">{pf.formState.errors.fullName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">Last name</label>
                        <input placeholder="Smith" disabled className={INPUT+' opacity-40 cursor-not-allowed'} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">Headline</label>
                      <input placeholder="Full-stack engineer · Remote · India" className={INPUT} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">Bio</label>
                      <textarea rows={3} placeholder="Tell employers about yourself..." className={INPUT+' resize-none'} />
                    </div>
                  </form>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => pf.reset()} className="px-5 py-2.5 rounded-xl border border-royal text-blush/50 text-sm font-semibold hover:border-mauve/30 hover:text-blush transition-all">Discard</button>
                  <button onClick={pf.handleSubmit(onProfile)} disabled={pf.formState.isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-grad-btn text-cream font-semibold text-sm shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px transition-all disabled:opacity-50">
                    {pf.formState.isSubmitting ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </>
            )}

            {/* ── Account ── */}
            {activeTab === 'Account' && (
              <div className="rounded-2xl border border-royal bg-deep/50 p-7">
                <h2 className="font-semibold text-cream text-[15px] mb-6">Account details</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Email',  value: user?.email  ?? '—' },
                    { label: 'Role',   value: user?.role   ?? '—' },
                    { label: 'Plan',   value: 'Free'               },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-royal/40 last:border-0">
                      <span className="text-[12px] text-blush/45 uppercase tracking-widest font-bold">{label}</span>
                      <span className="text-sm text-cream font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Notifications ── */}
            {activeTab === 'Notifications' && (
              <div className="rounded-2xl border border-royal bg-deep/50 p-7">
                <h2 className="font-semibold text-cream text-[15px] mb-6">Notifications</h2>
                <div className="space-y-5">
                  {[
                    { key:'emailDigests', label:'Email digests', desc:'Weekly summary of new jobs matching your skills' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-cream">{label}</p>
                        <p className="text-[11px] text-blush/35 mt-0.5">{desc}</p>
                      </div>
                      <Toggle on={prefs[key as keyof typeof prefs]} onChange={v => setPrefs(p => ({ ...p, [key]: v }))} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Security ── */}
            {activeTab === 'Security' && (
              <>
                <div className="rounded-2xl border border-royal bg-deep/50 p-7">
                  <h2 className="font-semibold text-cream text-[15px] mb-5">Two-factor authentication</h2>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-cream">Authenticator app</p>
                      <p className="text-[11px] text-blush/35 mt-0.5">Require a code from your authenticator app at sign-in</p>
                    </div>
                    <Toggle on={prefs.twoFactor} onChange={v => setPrefs(p => ({ ...p, twoFactor: v }))} />
                  </div>
                </div>
                <div className="rounded-2xl border border-royal bg-deep/50 p-7">
                  <h2 className="font-semibold text-cream text-[15px] mb-5">Change password</h2>
                  <form onSubmit={pwf.handleSubmit(onPassword)} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">Current password</label>
                      <input {...pwf.register('currentPassword')} type="password" placeholder="••••••••" className={INPUT} />
                      {pwf.formState.errors.currentPassword && <p className="text-mauve text-xs mt-1">{pwf.formState.errors.currentPassword.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">New password</label>
                      <input {...pwf.register('newPassword')} type="password" placeholder="8+ characters" className={INPUT} />
                      {pwf.formState.errors.newPassword && <p className="text-mauve text-xs mt-1">{pwf.formState.errors.newPassword.message}</p>}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => pwf.reset()} className="px-5 py-2.5 rounded-xl border border-royal text-blush/50 text-sm font-semibold hover:border-mauve/30 hover:text-blush transition-all">Discard</button>
                      <button type="submit" disabled={pwf.formState.isSubmitting}
                        className="px-6 py-2.5 rounded-xl bg-grad-btn text-cream font-semibold text-sm shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px transition-all disabled:opacity-50">
                        {pwf.formState.isSubmitting ? 'Saving...' : 'Update password'}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* ── Privacy ── */}
            {activeTab === 'Privacy' && (
              <div className="rounded-2xl border border-royal bg-deep/50 p-7">
                <h2 className="font-semibold text-cream text-[15px] mb-6">Privacy</h2>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-cream">Public profile</p>
                    <p className="text-[11px] text-blush/35 mt-0.5">Allow employers to find your profile via search</p>
                  </div>
                  <Toggle on={prefs.publicProfile} onChange={v => setPrefs(p => ({ ...p, publicProfile: v }))} />
                </div>
              </div>
            )}

            {/* ── API tokens ── */}
            {activeTab === 'API tokens' && (
              <div className="space-y-4">
                {/* Generate new token */}
                <div className="rounded-2xl border border-royal bg-deep/50 p-7">
                  <h2 className="font-semibold text-cream text-[15px] mb-1">API tokens</h2>
                  <p className="text-blush/35 text-sm mb-6">
                    Use tokens to authenticate requests to the SkillBridge API. Tokens are shown once — store them safely.
                  </p>
                  <div className="flex gap-3">
                    <input
                      value={newTokenName}
                      onChange={e => setNewTokenName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && generateToken()}
                      placeholder="Token name (e.g. My App)"
                      className={INPUT + ' flex-1'}
                    />
                    <button
                      onClick={generateToken}
                      className="px-5 py-2.5 rounded-xl bg-grad-btn text-cream text-sm font-semibold
                                 shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px
                                 transition-all flex-shrink-0">
                      Generate
                    </button>
                  </div>
                </div>

                {/* Revealed token — shown once */}
                {revealed && (
                  <div className="rounded-2xl border border-mauve/30 bg-mauve/8 p-5 animate-fade-up">
                    <p className="text-[10px] font-bold text-mauve uppercase tracking-widest mb-3">
                      Copy your token now — it won't be shown again
                    </p>
                    <div className="flex items-center gap-3 bg-void/60 border border-royal rounded-xl px-4 py-3">
                      <code className="flex-1 text-[12px] font-mono text-cream break-all">{revealed.full}</code>
                      <button
                        onClick={() => copyToken(revealed.full)}
                        className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-royal text-blush/50
                                   text-[11px] font-semibold hover:border-mauve/40 hover:text-blush transition-all">
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {/* Token list */}
                {tokens.length > 0 && (
                  <div className="rounded-2xl border border-royal bg-deep/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-royal">
                      <p className="text-[10px] font-bold text-blush/35 uppercase tracking-widest">
                        Active tokens ({tokens.length})
                      </p>
                    </div>
                    <div className="divide-y divide-royal/40">
                      {tokens.map(t => (
                        <div key={t.id} className="flex items-center justify-between px-6 py-4 gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-cream truncate">{t.name}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <code className="text-[11px] font-mono text-blush/40">{t.preview}</code>
                              <span className="text-[10px] text-blush/25">
                                Created {new Date(t.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => revokeToken(t.id)}
                            className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-royal/60
                                       text-[11px] font-semibold text-blush/35
                                       hover:border-red-800/50 hover:text-red-400 hover:bg-red-950/20
                                       transition-all">
                            Revoke
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tokens.length === 0 && !revealed && (
                  <div className="rounded-2xl border border-dashed border-royal/40 bg-void/20 p-10 text-center">
                    <p className="text-blush/25 text-sm">No tokens yet — generate one above</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
