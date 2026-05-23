import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-deep/50 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-royal/30 blur-[80px] rounded-full" />
      </div>
      <div className="relative text-center animate-fade-up">
        <p className="text-[120px] font-black text-royal/20 leading-none mb-4 select-none">404</p>
        <h1 className="text-3xl font-black text-cream mb-3 -mt-6">Page not found</h1>
        <p className="text-blush/40 text-sm mb-8 max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                     bg-gradient-to-r from-royal to-mauve text-cream font-semibold text-sm
                     shadow-royal hover:shadow-mauve hover:-translate-y-px transition-all">
          Back to home →
        </Link>
      </div>
    </div>
  );
}
