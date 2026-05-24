import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-void overflow-hidden">

      {/* Hero */}
      <section className="relative pt-40 pb-10 px-6 text-center overflow-hidden">
        <div className="gc-halo-hero animate-halo" />

        <div className="relative z-10 max-w-4xl mx-auto">

          {/* Eyebrow chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          border border-royal bg-deep/80 mb-10 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-mauve flex-shrink-0" />
            <span className="text-[11px] font-semibold text-blush/70 tracking-[0.15em] uppercase">
              Verify your skills · Land your dream role
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[76px] md:text-[96px] font-bold tracking-tight leading-[0.9]
                         mb-6 animate-fade-up text-cream">
            Prove what
            <br />
            <span className="text-mauve">you know.</span>
          </h1>

          <p className="text-[17px] text-blush/50 max-w-md mx-auto mb-10 leading-relaxed
                        animate-fade-up [animation-delay:100ms]">
            Solve real coding challenges. Earn permanent verifiable badges
            any employer can check with one click.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-12
                          animate-fade-up [animation-delay:180ms]">
            <Link href="/challenges"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full
                         bg-grad-btn text-cream font-semibold text-[14px]
                         shadow-royal shadow-btn-inset hover:shadow-mauve hover:-translate-y-0.5
                         transition-all duration-200 active:translate-y-0">
              Browse challenges
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                         border border-royal/60 text-blush/70 font-semibold text-[14px]
                         hover:bg-royal/30 hover:text-cream hover:border-mauve/20
                         transition-all duration-200">
              Watch demo
            </Link>
          </div>

          {/* Hex language orbit */}
          <div className="flex items-center justify-center gap-0 animate-fade-up [animation-delay:260ms]">
            {/* Left UI icons */}
            <div className="flex flex-col gap-2 mr-5 opacity-60">
              <div className="w-11 h-11 rounded-xl border border-royal bg-deep/70 flex items-center justify-center text-blush/40 text-sm">
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div className="w-11 h-11 rounded-xl border border-royal bg-deep/70 flex items-center justify-center text-blush/40 text-sm">
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M5 7l1.5 1.5L9 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>

            {/* Hex badges */}
            <div className="flex items-center">
              {/* Py */}
              <div className="w-14 h-14 flex items-center justify-center text-blush/50 text-[13px] font-semibold"
                style={{ clipPath:'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)', background:'#131316', border:'1.5px solid #26262B' }}>
                Py
              </div>
              <div className="w-10 border-t border-dashed border-mauve/35 mx-1" />
              {/* JS — active */}
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center text-cream text-[14px] font-bold"
                  style={{ clipPath:'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)', background:'#1a1612', border:'1.5px solid #FF4F00' }}>
                  JS
                </div>
                <div className="absolute -bottom-2 w-8 h-0.5 bg-mauve rounded-full" />
              </div>
              <div className="w-10 border-t border-dashed border-mauve/35 mx-1" />
              {/* C# */}
              <div className="w-14 h-14 flex items-center justify-center text-blush/50 text-[13px] font-semibold"
                style={{ clipPath:'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)', background:'#131316', border:'1.5px solid #26262B' }}>
                C#
              </div>
            </div>

            {/* Right UI icons */}
            <div className="flex flex-col gap-2 ml-5 opacity-60">
              <div className="w-11 h-11 rounded-xl border border-royal bg-deep/70 flex items-center justify-center text-blush/40">
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M2 2h4M2 2v4M12 2h-4M12 2v4M2 12h4M2 12v-4M12 12h-4M12 12v-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </div>
              <div className="w-11 h-11 rounded-xl border border-royal bg-deep/70 flex items-center justify-center text-blush/40">
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative px-6 py-12 animate-fade-up [animation-delay:320ms]">
        <div className="max-w-xl mx-auto rounded-2xl border border-royal bg-deep/60">
          <div className="grid grid-cols-3 divide-x divide-royal">
            {[
              { value: '6+',   label: 'Skills',     sub: 'and growing',  orange: false },
              { value: '30+',  label: 'Challenges', sub: 'across stacks', orange: false },
              { value: '100%', label: 'Free',       sub: 'forever',       orange: true  },
            ].map((s) => (
              <div key={s.label} className="py-8 text-center">
                <p className={`text-3xl font-semibold mb-0.5 ${s.orange ? 'text-mauve' : 'text-cream'}`}>{s.value}</p>
                <p className="text-[10px] font-bold text-blush/50 uppercase tracking-widest">{s.label}</p>
                <p className="text-[11px] text-blush/25 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold text-mauve uppercase tracking-[0.2em] mb-3">How it works</p>
            <h2 className="text-[38px] font-semibold text-cream tracking-tight">Three steps to verified</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: '01', title: 'Pick a challenge',      body: 'Choose from Python, React, C#, SQL and more. Each challenge tests real-world skills.',                                      delay: '0ms'   },
              { n: '02', title: 'Code in your browser',  body: 'Write your solution in our Monaco editor with syntax highlighting and instant feedback.',                                   delay: '80ms'  },
              { n: '03', title: 'Earn your badge',       body: 'Pass the challenge and earn a permanent shareable credential with a public verify URL.',                                    delay: '160ms' },
            ].map((f) => (
              <div key={f.n}
                className="group relative rounded-2xl border border-royal bg-deep/50 p-7
                           hover:border-mauve/30 hover:bg-deep/80 hover:-translate-y-1
                           transition-all duration-300 animate-fade-up overflow-hidden"
                style={{ animationDelay: f.delay }}>
                <div className="absolute top-4 right-5 font-mono text-5xl font-semibold text-mauve/12
                                group-hover:text-mauve/20 transition-colors duration-300 select-none leading-none">
                  {f.n}
                </div>
                <div className="w-9 h-9 rounded-xl bg-mauve/12 border border-mauve/20
                                flex items-center justify-center mb-5 text-mauve font-mono text-xs font-bold">
                  {f.n}
                </div>
                <h3 className="font-semibold text-cream text-[15px] mb-2 tracking-tight">{f.title}</h3>
                <p className="text-blush/45 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-6 pb-32 relative">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64
                        bg-gradient-to-t from-[rgba(255,79,0,0.12)] to-transparent" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-[40px] md:text-[48px] font-semibold text-cream tracking-tight mb-4 leading-tight">
            Ready to ship verified skills?
          </h2>
          <p className="text-blush/40 text-[15px] mb-8 max-w-sm mx-auto leading-relaxed">
            Free forever for candidates. One click to add a credential check to any application.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                       border border-royal/60 text-cream font-semibold text-[14px]
                       hover:bg-royal/30 hover:border-mauve/30
                       transition-all duration-200">
            Create free account
          </Link>
        </div>
      </section>

    </main>
  );
}
