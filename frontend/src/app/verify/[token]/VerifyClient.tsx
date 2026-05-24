'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Cred {
  skillName: string; skillCategory: string; candidateName: string;
  scorePercentile: number; issuedAt: string; expiresAt?: string;
  publicToken: string; isRevoked: boolean;
}

export default function VerifyClient({ cred }: { cred: Cred }) {
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => { setPageUrl(window.location.href); }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(pageUrl);
    const title = encodeURIComponent(`I earned a verified ${cred.skillName} credential on SkillBridge!`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
  };

  const issued  = new Date(cred.issuedAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
  const expires = cred.expiresAt ? new Date(cred.expiresAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : 'Never';

  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Orange radial glow from bottom */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                        rounded-full blur-[80px]"
             style={{ background: 'radial-gradient(ellipse at center, rgba(255,79,0,0.45) 0%, rgba(255,79,0,0.1) 55%, transparent 75%)' }} />
      </div>

      {/* Verified chip */}
      <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full
                      border border-mauve/40 bg-mauve/10 mb-8 animate-fade-in">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="6.5" r="6" stroke="#FF4F00" strokeWidth="1.2"/>
          <path d="M4 6.5l1.8 1.8L9 4.5" stroke="#FF4F00" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[11px] font-bold text-mauve uppercase tracking-[0.15em]">
          Verified credential
        </span>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        <div className="rounded-3xl border border-royal/60 bg-deep/80 backdrop-blur-md overflow-hidden
                        shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

          {/* Orange badge circle */}
          <div className="flex justify-center pt-10 pb-6">
            <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center
                            shadow-[0_0_40px_rgba(255,79,0,0.5)]"
                 style={{ background: 'linear-gradient(160deg, #FF6A1F 0%, #D63A00 100%)' }}>
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Verified</span>
              <span className="text-3xl font-bold text-white leading-tight">{cred.scorePercentile}%</span>
              <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wide">
                {cred.skillName.toUpperCase().slice(0,8)}
              </span>
            </div>
          </div>

          {/* Name & context */}
          <div className="text-center px-8 pb-6">
            <p className="text-[10px] font-bold text-blush/35 uppercase tracking-widest mb-2">Awarded to</p>
            <h1 className="text-2xl font-semibold text-cream mb-1">{cred.candidateName}</h1>
            <p className="text-blush/40 text-sm">
              for passing <span className="text-blush/65 font-medium">{cred.skillName}</span>
            </p>
          </div>

          {/* Metadata 2×2 grid */}
          <div className="grid grid-cols-2 gap-px bg-royal/40 border-t border-royal/40">
            {[
              { label: 'Issued',   value: issued  },
              { label: 'Expires',  value: expires },
              { label: 'Score',    value: `${cred.scorePercentile}%` },
              { label: 'Token',    value: cred.publicToken.slice(0,12)+'…' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-deep/60 px-4 py-4">
                <p className="text-[9px] font-bold text-blush/30 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-[13px] font-semibold text-cream font-mono">{value}</p>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <div className="p-5">
            <button onClick={shareLinkedIn}
              className="w-full py-3.5 rounded-xl bg-grad-btn text-cream font-semibold text-sm
                         shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-px
                         transition-all duration-200 active:translate-y-0">
              Share on LinkedIn ↗
            </button>
          </div>
        </div>

        {/* Copy link */}
        <button onClick={copyLink}
          className="mt-3 w-full py-3 rounded-xl border border-royal text-blush/40
                     text-xs font-semibold hover:border-mauve/30 hover:text-blush
                     transition-all duration-200">
          {copied ? '✓ Link copied!' : 'Copy verify link'}
        </button>

        <p className="text-center text-[11px] text-blush/20 mt-4">
          Issued by SkillBridge · {pageUrl}
        </p>
      </div>
    </div>
  );
}
