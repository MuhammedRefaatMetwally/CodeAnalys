import Link from 'next/link';
import { LandingNav } from '@/components/shared/LandingNav';
import { LandingCTA } from '@/components/shared/LandingCTA';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Analysis',
    desc: 'Paste a GitHub PR URL and get AI-powered feedback in under 30 seconds.',
  },
  {
    icon: '🔍',
    title: 'Deep Code Review',
    desc: 'Detects code smells, security issues, and bad practices file by file.',
  },
  {
    icon: '📊',
    title: 'Quality Score',
    desc: 'Every PR gets a score from 0–100 with a clear breakdown of what to fix.',
  },
  {
    icon: '🔄',
    title: 'Async Processing',
    desc: 'Jobs run in the background via a queue — no timeouts, no waiting screens.',
  },
];

const STEPS = [
  { step: '01', title: 'Paste PR URL', desc: 'Copy any public GitHub pull request URL.' },
  { step: '02', title: 'AI Analyzes', desc: 'Gemini reviews every changed file in the PR.' },
  { step: '03', title: 'Get Results', desc: 'View your score, issues, and file-by-file feedback.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <LandingNav />

      {/* Hero */}
      <section className="relative px-6 py-28 sm:py-36">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(34,197,94,0.07) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-xs font-mono tracking-wider uppercase">
              Powered by Gemini AI
            </span>
          </div>

          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            AI Code Review
            <br />
            <span className="text-green-500">In Seconds.</span>
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Paste a GitHub PR URL and get instant, detailed feedback on code
            quality, security issues, and best practices — powered by Gemini AI.
          </p>

          <LandingCTA />

          <p className="text-zinc-600 text-xs font-mono mt-8">
            No credit card required · Free to use · Instant results
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest text-center mb-12">
            How it works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="text-center space-y-3">
                <div
                  className="text-5xl font-black text-zinc-800"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {step}
                </div>
                <h3 className="text-white font-bold text-lg">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest text-center mb-12">
            Features
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="text-2xl mb-4">{icon}</div>
                <h3
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-20 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2
            className="text-3xl sm:text-4xl font-black"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Ready to review smarter?
          </h2>
          <p className="text-zinc-500 text-base">
            Join developers using DevLens to ship better code faster.
          </p>
          <LandingCTA />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
              DevLens
            </span>
          </div>
          <p className="text-zinc-700 text-xs font-mono">
            Built with NestJS · Next.js · Gemini AI · BullMQ
          </p>
        </div>
      </footer>
    </div>
  );
}