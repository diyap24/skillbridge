'use client';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

interface Cred {
  skillName: string; skillCategory: string; candidateName: string;
  scorePercentile: number; issuedAt: string; expiresAt?: string;
  publicToken: string; isRevoked: boolean;
}

export default function VerifyClient({ cred }: { cred: Cred }) {
  const [qrUrl, setQrUrl]   = useState('');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (!pageUrl) return;
    QRCode.toDataURL(pageUrl, {
      width: 160, margin: 1,
      color: { dark: '#FBE4D8', light: '#2B124C' },
    }).then(setQrUrl).catch(console.error);
  }, [pageUrl]);

  const copyToken = async () => {
    await navigator.clipboard.writeText(cred.publicToken);
    setCopied(true);
    toast.success('Token copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBadge = async () => {
    const { default: html2canvas } = await import('html2canvas');
    if (!cardRef.current) return;
    toast('Generating badge...', { icon: '⏳' });
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#2B124C', scale: 2, useCORS: true,
    });
    const link = document.createElement('a');
    link.download = `skillbridge-${cred.skillName.toLowerCase()}-badge.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Badge downloaded!');
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(pageUrl);
    const title = encodeURIComponent(`I earned a verified ${cred.skillName} credential on SkillBridge!`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
  };

  const issued = new Date(cred.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const now = new Date();
  const expiryPercent = cred.expiresAt
    ? Math.max(5, Math.min(100,
        (new Date(cred.expiresAt).getTime() - now.getTime()) /
        (new Date(cred.expiresAt).getTime() - new Date(cred.issuedAt).getTime()) * 100
      ))
    : 100;

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-deep/50 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-royal/30 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">

        {/* Badge card */}
        <div ref={cardRef}
          className="rounded-3xl border border-royal/25 bg-deep/40 backdrop-blur-md p-10
                     shadow-2xl shadow-void/60 text-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-royal to-mauve
                          flex items-center justify-center mx-auto mb-5 text-5xl
                          shadow-[0_0_40px_rgba(133,79,108,0.4)] animate-float">
            🏅
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          border border-royal/30 bg-royal/15 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-mauve opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mauve" />
            </span>
            <span className="text-[11px] font-bold text-blush/80 uppercase tracking-[0.15em]">
              Verified credential
            </span>
          </div>
          <h1 className="text-3xl font-black text-cream tracking-tight mb-1">{cred.skillName}</h1>
          <p className="text-blush/40 text-sm mb-8">{cred.skillCategory}</p>

          <div className="space-y-3 border-t border-royal/15 pt-7 text-left">
            {[
              { label: 'Awarded to',       value: cred.candidateName },
              { label: 'Score percentile', value: `${cred.scorePercentile}%` },
              { label: 'Issued on',        value: issued },
              { label: 'Expires', value: cred.expiresAt ? new Date(cred.expiresAt).toLocaleDateString() : 'Never' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-royal/10 last:border-0">
                <p className="text-[10px] font-semibold text-blush/30 uppercase tracking-widest">{label}</p>
                <p className="font-bold text-cream text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Expiry progress bar */}
          {cred.expiresAt && (
            <div className="mt-5">
              <div className="flex justify-between text-[10px] text-blush/30 mb-1.5">
                <span>Validity</span>
                <span>{Math.round(expiryPercent)}% remaining</span>
              </div>
              <div className="h-1 bg-royal/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-royal to-mauve rounded-full transition-all duration-1000"
                     style={{ width: `${expiryPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Token with copy */}
        <div className="rounded-2xl border border-royal/20 bg-deep/30 backdrop-blur-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-semibold text-blush/30 uppercase tracking-widest">
              Credential token
            </p>
            <button onClick={copyToken}
              className="text-xs font-semibold text-mauve hover:text-blush transition-colors flex items-center gap-1">
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <p className="font-mono text-[11px] text-blush/50 break-all">{cred.publicToken}</p>
        </div>

        {/* QR Code */}
        {qrUrl && (
          <div className="rounded-2xl border border-royal/20 bg-deep/30 backdrop-blur-sm p-5 mb-4 flex items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="QR code" className="w-20 h-20 rounded-xl flex-shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-blush/50 uppercase tracking-widest mb-1">
                Scan to verify
              </p>
              <p className="text-xs text-blush/30 leading-relaxed">
                Share this QR code so anyone can verify your credential instantly.
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button onClick={downloadBadge}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl
                       border border-royal/20 bg-deep/20 hover:border-mauve/35
                       hover:bg-deep/40 transition-all duration-200 group">
            <span className="text-xl">⬇️</span>
            <span className="text-[10px] font-semibold text-blush/40 group-hover:text-blush/70 transition-colors">
              Download PNG
            </span>
          </button>
          <button onClick={shareLinkedIn}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl
                       border border-royal/20 bg-deep/20 hover:border-mauve/35
                       hover:bg-deep/40 transition-all duration-200 group">
            <span className="text-xl">💼</span>
            <span className="text-[10px] font-semibold text-blush/40 group-hover:text-blush/70 transition-colors">
              Share LinkedIn
            </span>
          </button>
          <button onClick={copyToken}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl
                       border border-royal/20 bg-deep/20 hover:border-mauve/35
                       hover:bg-deep/40 transition-all duration-200 group">
            <span className="text-xl">{copied ? '✅' : '🔗'}</span>
            <span className="text-[10px] font-semibold text-blush/40 group-hover:text-blush/70 transition-colors">
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}