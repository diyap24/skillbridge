import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-void overflow-hidden relative">

      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] bg-deep/50 top-[-100px] left-[-100px]" />
      <div className="orb w-[500px] h-[500px] bg-royal/30 bottom-[-50px] right-[-50px]
                      animate-pulse-slow" />
      <div className="orb w-[300px] h-[300px] bg-mauve/20 top-[60%] left-[40%]
                      animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Hero */}
      <section className="relative z-10 pt-44 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2.5 glass px-5 py-2.5 rounded-full
                          mb-10 animate-fade-in shadow-lg shadow-royal/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full
                               bg-mauve opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mauve" />
            </span>
            <span className="text-blush text-sm font-medium">
              Verify your skills. Land your dream role.
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-cream mb-6 leading-none
                         tracking-tight animate-fade-up">
            Prove what
            <br />
            <span className="bg-gradient-to-r from-royal via-mauve to-blush
                             bg-clip-text text-transparent">
              you know.
            </span>
          </h1>

          <p className="text-xl text-blush/60 max-w-xl mx-auto mb-12 leading-relaxed
                        animate-fade-up font-light"
             style={{ animationDelay: '0.15s' }}>
            Solve real coding challenges. Earn permanent verifiable badges
            that employers can check with one click.
          </p>

          <div className="flex gap-4 justify-center flex-wrap animate-fade-up"
               style={{ animationDelay: '0.25s' }}>
            <Link href="/challenges"
              className="btn-primary text-base px-8 py-3.5 animate-glow">
              Browse Challenges →
            </Link>
            <Link href="/register" className="btn-ghost text-base px-8 py-3.5">
              Create Free Account
            </Link>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-3xl mx-auto glass rounded-3xl px-10 py-8
                        animate-fade-up shadow-2xl shadow-royal/20"
             style={{ animationDelay: '0.35s' }}>
          <div className="grid grid-cols-3 divide-x divide-royal/20">
            {[
              { value: '6+',   label: 'Skills to verify',   sub: 'and growing' },
              { value: '3+',   label: 'Live challenges',    sub: 'across stacks' },
              { value: '100%', label: 'Free to use',        sub: 'forever' },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-6">
                <p className="text-4xl font-black bg-gradient-to-b from-cream to-blush
                               bg-clip-text text-transparent mb-0.5">
                  {stat.value}
                </p>
                <p className="text-blush/80 text-sm font-medium">{stat.label}</p>
                <p className="text-blush/30 text-xs">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 pb-36">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 animate-fade-up">
            <p className="text-mauve text-sm font-semibold uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-4xl font-black text-cream">
              Three steps to verified
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                icon: '🎯',
                title: 'Pick a challenge',
                desc: 'Choose from Python, React, C#, SQL and more. Each challenge tests real skills.',
                delay: '0s',
              },
              {
                num: '02',
                icon: '⌨️',
                title: 'Code in browser',
                desc: 'Write your solution in our Monaco editor with syntax highlighting and language switching.',
                delay: '0.12s',
              },
              {
                num: '03',
                icon: '🏅',
                title: 'Earn your badge',
                desc: 'Pass the challenge and earn a permanent shareable credential with a public verify URL.',
                delay: '0.24s',
              },
            ].map((f) => (
              <div key={f.num}
                className="card group animate-fade-up relative overflow-hidden"
                style={{ animationDelay: f.delay }}>
                <div className="absolute top-0 right-0 text-8xl font-black
                                text-royal/10 group-hover:text-royal/20
                                transition-colors duration-500 leading-none pr-4 pt-2
                                select-none pointer-events-none">
                  {f.num}
                </div>
                <div className="text-4xl mb-5">{f.icon}</div>
                <h3 className="font-bold text-cream text-lg mb-2">{f.title}</h3>
                <p className="text-blush/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
