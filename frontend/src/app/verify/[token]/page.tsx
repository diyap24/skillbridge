import { notFound } from 'next/navigation';

async function getCredential(token: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/credentials/verify/${token}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function VerifyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const cred = await getCredential(token);
  if (!cred) notFound();
  const issued = new Date(cred.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-deep/50 top-0 left-0" />
      <div className="orb w-80 h-80 bg-royal/30 bottom-0 right-0" />
      <div className="relative z-10 glass rounded-3xl p-10 max-w-md w-full text-center
                       animate-fade-up shadow-2xl shadow-void/60">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-royal to-mauve
                        flex items-center justify-center mx-auto mb-6 text-6xl
                        shadow-2xl shadow-royal/50 animate-float">
          🏅
        </div>
        <div className="inline-flex items-center gap-2 bg-mauve/15 border border-mauve/25
                        rounded-full px-5 py-2 mb-7">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mauve opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-mauve" />
          </span>
          <span className="text-blush text-xs font-semibold uppercase tracking-wider">
            Verified credential
          </span>
        </div>
        <h1 className="text-4xl font-black text-cream mb-1">{cred.skillName}</h1>
        <p className="text-blush/40 text-sm mb-10">{cred.skillCategory}</p>
        <div className="space-y-4 border-t border-royal/15 pt-8 text-left">
          {[
            { label: 'Awarded to',       value: cred.candidateName },
            { label: 'Score percentile', value: `${cred.scorePercentile}%` },
            { label: 'Issued on',        value: issued },
            { label: 'Expires',          value: cred.expiresAt ? new Date(cred.expiresAt).toLocaleDateString() : 'Never' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2
                                         border-b border-royal/10 last:border-0">
              <p className="text-xs text-blush/30 uppercase tracking-widest font-medium">{label}</p>
              <p className="font-bold text-cream text-sm">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-void/60 rounded-2xl border border-royal/15">
          <p className="text-xs text-blush/30 uppercase tracking-widest mb-2">Credential token</p>
          <p className="font-mono text-xs text-blush/50 break-all leading-relaxed">{cred.publicToken}</p>
        </div>
      </div>
    </div>
  );
}