import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">

      {/* Hero */}
      <div className="text-center mb-20">
        <span className="inline-block bg-blue-50 text-blue-700 text-sm font-medium
                         px-4 py-1.5 rounded-full mb-6 border border-blue-100">
          Free for all developers
        </span>
        <h1 className="text-5xl font-bold text-slate-900 mb-5 leading-tight">
          Prove what you know.
          <br />
          <span className="text-blue-600">Get certified.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          Solve real coding challenges. Earn verifiable credentials
          that any employer can check with one click.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/challenges"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium
                       hover:bg-blue-700 transition-colors text-sm">
            Browse Challenges
          </Link>
          <Link
            href="/register"
            className="border border-slate-200 text-slate-700 px-8 py-3 rounded-xl
                       font-medium hover:bg-slate-100 transition-colors text-sm">
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: '🎯',
            title: 'Solve real challenges',
            desc: 'Code in your browser across Python, JavaScript, C#, and more. No setup needed.',
          },
          {
            icon: '🏅',
            title: 'Earn credentials',
            desc: 'Pass a challenge, get a permanent verifiable badge — shareable anywhere.',
          },
          {
            icon: '✅',
            title: 'Instant verification',
            desc: 'Share a link. Employers verify your skill in one click — no PDF, no email.',
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-sm
                       transition-shadow">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
