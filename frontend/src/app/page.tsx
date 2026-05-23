import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void overflow-hidden">

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full
                        bg-deep/60 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full
                        bg-royal/40 blur-[100px]" />
        <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full
                        bg-mauve/20 blur-[80px]" />
      </div>

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          border border-royal/40 bg-royal/10 backdrop-blur-sm
                          mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-mauve opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mauve" />
            </span>
            <span className="text-xs font-semibold text-blush/80 tracking-wide">
              Verify your skills. Land your dream role.
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-7xl md:text-8xl font-black tracking-tight leading-[0.9] mb-6
                         animate-fade-up text-cream">
            Prove what
            <br />
            <span className="bg-gradient-to-r from-mauve via-blush to-cream
                             bg-clip-text text-transparent">
              you know.
            </span>
          </h1>

          <p className="text-lg text-blush/50 max-w-lg mx-auto mb-10 leading-relaxed font-light
                        animate-fade-up [animation-delay:100ms]">
            Solve real coding challenges. Earn permanent verifiable badges
            any employer can check with one click.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap
                          animate-fade-up [animation-delay:200ms]">
            <Link href="/challenges"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                         bg-grad-btn text-cream font-semibold text-sm shadow-royal
                         hover:shadow-mauve hover:-translate-y-0.5
                         transition-all duration-200 active:translate-y-0">
              Browse challenges
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                         border border-royal/40 text-blush/80 font-semibold text-sm
                         hover:bg-royal/15 hover:text-cream hover:border-mauve/50
                         transition-all duration-200">
              Create free account
            </Link>
          </div>

        </div>
      </section>

      {/* Stats bar */}
      <section className="relative px-6 pb-16 animate-fade-up [animation-delay:300ms]">
        <div className="max-w-2xl mx-auto rounded-2xl border border-royal/20
                        bg-deep/30 backdrop-blur-md shadow-inner-royal overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-royal/20">
            {[
              { value: '6+',   label: 'Skills', sub: 'and growing' },
              { value: '3+',   label: 'Challenges', sub: 'across stacks' },
              { value: '100%', label: 'Free', sub: 'forever' },
            ].map((s) => (
              <div key={s.label} className="py-7 text-center">
                <p className="text-3xl font-black text-cream mb-0.5">{s.value}</p>
                <p className="text-xs font-semibold text-blush/70 uppercase tracking-widest">
                  {s.label}
                </p>
                <p className="text-[11px] text-blush/30 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-mauve uppercase tracking-[0.2em] mb-3">
              How it works
            </p>
            <h2 className="text-4xl font-black text-cream tracking-tight">
              Three steps to verified
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: '01', icon: '🎯', title: 'Pick a challenge',
                body: 'Choose from Python, React, C#, SQL and more. Each challenge tests real-world skills.',
                delay: '0ms',
              },
              {
                n: '02', icon: '⌨️', title: 'Code in your browser',
                body: 'Write your solution in our Monaco editor with syntax highlighting and instant feedback.',
                delay: '80ms',
              },
              {
                n: '03', icon: '🏅', title: 'Earn your badge',
                body: 'Pass the challenge and earn a permanent shareable credential with a public verify URL.',
                delay: '160ms',
              },
            ].map((f) => (
              <div key={f.n}
                className="group relative rounded-2xl border border-royal/20 bg-deep/25
                           backdrop-blur-sm p-7 overflow-hidden
                           hover:border-mauve/35 hover:bg-deep/40
                           hover:-translate-y-1 transition-all duration-300
                           animate-fade-up"
                style={{ animationDelay: f.delay }}>
                <div className="absolute top-4 right-5 text-6xl font-black text-royal/15
                                group-hover:text-royal/25 transition-colors duration-300 select-none
                                leading-none">
                  {f.n}
                </div>
                <div className="text-3xl mb-5">{f.icon}</div>
                <h3 className="font-bold text-cream text-[15px] mb-2 tracking-tight">{f.title}</h3>
                <p className="text-blush/45 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
