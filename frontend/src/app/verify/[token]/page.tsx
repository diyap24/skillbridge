import { notFound } from 'next/navigation';

async function getCredential(token: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(
      `${apiUrl}/credentials/verify/${token}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const cred = await getCredential(token);
  if (!cred) notFound();

  const issued = new Date(cred.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">
          🏅
        </div>
        <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-5">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-green-700 text-xs font-medium">Verified credential</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{cred.skillName}</h1>
        <p className="text-slate-500 text-sm mb-6">{cred.skillCategory}</p>
        <div className="text-left space-y-4 border-t border-slate-100 pt-6">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Awarded to</p>
            <p className="font-semibold text-slate-800">{cred.candidateName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Score percentile</p>
            <p className="font-semibold text-slate-800">{cred.scorePercentile}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Issued on</p>
            <p className="font-semibold text-slate-800">{issued}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Expires</p>
            <p className="font-semibold text-slate-800">
              {cred.expiresAt ? new Date(cred.expiresAt).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>
        <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-400 mb-1">Credential token</p>
          <p className="font-mono text-xs text-slate-600 break-all">{cred.publicToken}</p>
        </div>
      </div>
    </div>
  );
}