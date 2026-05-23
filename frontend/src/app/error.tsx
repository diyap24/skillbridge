'use client';
import Link from 'next/link';
import { useEffect } from 'react';


export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-deep/50 blur-[100px] rounded-full" />
      </div>
      <div className="relative text-center animate-fade-up">
        <p className="text-[120px] font-black text-royal/20 leading-none mb-4 select-none">500</p>
        <h1 className="text-3xl font-black text-cream mb-3 -mt-6">Something went wrong</h1>
        <p className="text-blush/40 text-sm mb-8 max-w-sm mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                       bg-gradient-to-r from-royal to-mauve text-cream font-semibold text-sm
                       shadow-royal hover:shadow-mauve hover:-translate-y-px transition-all">
            Try again →
          </button>
          <Link href="/"
            className="inline-flex items-center px-7 py-3.5 rounded-xl border border-royal/30
                       text-blush/60 font-semibold text-sm hover:bg-royal/15 transition-all">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
