import { LandingNav } from '@/components/shared/LandingNav';
import { LandingCTA } from '@/components/shared/LandingCTA';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Analysis',
    desc: 'Feedback in under 30 seconds. No waiting, no polling manually.',
  },
  {
    icon: '🔍',
    title: 'File-by-File Review',
    desc: 'Every changed file is analyzed individually with specific, actionable issues.',
  },
  {
    icon: '📊',
    title: 'Quality Score',
    desc: 'A 0–100 score with severity breakdown — critical, warning, suggestion.',
  },
  {
    icon: '🔄',
    title: 'Background Queue',
    desc: 'Jobs run async via BullMQ. The API never blocks, never times out.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Paste a PR URL',
    desc: 'Any public GitHub pull request URL.',
  },
  {
    step: '02',
    title: 'Gemini reviews it',
    desc: 'AI reads every changed file and identifies real issues.',
  },
  {
    step: '03',
    title: 'Read the report',
    desc: 'Score, summary, and file-by-file breakdown.',
  },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundColor: '#080808',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
      }}
    >
      <LandingNav />

      <section className="relative px-6 pt-20 pb-28 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.09) 0%, transparent 65%)',
          }}
        />

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

        <div className="max-w-5xl mx-auto relative">
          <div className="inline-flex items-center gap-2 border border-zinc-800 rounded-full px-3.5 py-1.5 mb-10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            <span className="font-mono text-[11px] text-zinc-400 tracking-widest uppercase">
              Gemini 1.5 Flash · Live
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h1
                className="leading-[1.08] tracking-tight mb-6"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <span className="block text-[2.8rem] sm:text-[3.5rem] font-extralight text-zinc-400">
                  Code review
                </span>
                <span className="block text-[2.8rem] sm:text-[3.5rem] font-bold text-white">
                  that actually
                </span>
                <span
                  className="block text-[2.8rem] sm:text-[3.5rem] font-bold"
                  style={{
                    background: 'linear-gradient(90deg, #22c55e 0%, #4ade80 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  reads the code.
                </span>
              </h1>

              <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-md font-light">
                Paste a GitHub PR URL. CodeAnalys fetches every changed file,
                sends it to Gemini AI, and returns a structured quality
                report — in under 30 seconds.
              </p>

              <LandingCTA />

              <div className="flex items-center gap-5 mt-8">
                {[
                  ['No sign-up fee', '✓'],
                  ['Public PRs only', '✓'],
                  ['Results in ~20s', '✓'],
                ].map(([label, check]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="text-green-500 text-xs font-mono">{check}</span>
                    <span className="text-zinc-600 text-xs font-mono">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute -inset-4 rounded-2xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)',
                }}
              />

              <div className="relative bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/60">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="font-mono text-[11px] text-zinc-600">
                    CodeAnalys · analysis
                  </span>
                  <div className="w-12" />
                </div>

                <div className="p-5 font-mono text-[13px] space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-zinc-700 mt-px">$</span>
                    <span className="text-zinc-300">
                      CodeAnalys analyze{' '}
                      <span className="text-green-400">
                        github.com/acme/api/pull/94
                      </span>
                    </span>
                  </div>

                  <div className="border-t border-zinc-800/50 pt-3 space-y-2.5">
                    {[
                      { label: 'Fetching PR diff', value: '8 files', color: 'text-zinc-300' },
                      { label: 'Sending to Gemini', value: 'in progress…', color: 'text-zinc-500' },
                      { label: 'Parsing response', value: 'done', color: 'text-green-400' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-zinc-600">{label}</span>
                        <span className={color}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 border border-zinc-800 rounded-lg p-4 bg-zinc-900/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs uppercase tracking-widest">
                        Result
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-bold text-white">74</span>
                        <span className="text-zinc-600 text-xs">/100</span>
                        <span className="ml-1 text-xs px-2 py-0.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400">
                          Good
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {[
                        { label: '1 critical', color: 'bg-red-500' },
                        { label: '3 warnings', color: 'bg-yellow-500' },
                        { label: '4 suggestions', color: 'bg-blue-500' },
                      ].map(({ label, color }) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                          <span className="text-zinc-500 text-xs">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-zinc-500">
                      Completed in{' '}
                      <span className="text-white">22.4s</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <span className="font-mono text-[11px] text-zinc-600 uppercase tracking-[0.2em]">
              How it works
            </span>
            <div className="h-px flex-1 bg-zinc-900" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-900">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="py-8 sm:py-0 sm:px-8 first:pl-0 last:pr-0 space-y-4">
                <span className="font-mono text-[11px] text-zinc-700">{step}</span>
                <h3 className="text-white font-semibold text-base leading-snug">
                  {title}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <span className="font-mono text-[11px] text-zinc-600 uppercase tracking-[0.2em]">
              What you get
            </span>
            <div className="h-px flex-1 bg-zinc-900" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 rounded-xl overflow-hidden">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#080808] p-7 hover:bg-zinc-900/40 transition-colors duration-300 group"
              >
                <span className="text-lg">{icon}</span>
                <h3 className="text-white font-semibold text-sm mt-4 mb-2 group-hover:text-green-400 transition-colors">
                  {title}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-xl border border-zinc-800 px-8 py-12 relative overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at 50% 100%, rgba(34,197,94,0.05) 0%, transparent 70%), #0d0d0d',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
            <div className="max-w-lg">
              <h2 className="text-2xl font-bold text-white mb-2 leading-snug">
                Ship better code.
                <br />
                <span className="text-zinc-500 font-light">
                  Start reviewing in 30 seconds.
                </span>
              </h2>
              <p className="text-zinc-600 text-sm mb-8">
                Free to use. Powered by Gemini AI. No setup required.
              </p>
              <LandingCTA />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900 px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="font-mono text-[11px] text-zinc-600 tracking-[0.2em] uppercase">
              CodeAnalys
            </span>
          </div>
          <div className="flex items-center gap-4">
            {['NestJS', 'Next.js', 'Gemini AI', 'BullMQ', 'PostgreSQL'].map(
              (tech, i, arr) => (
                <span key={tech} className="flex items-center gap-4">
                  <span className="font-mono text-[11px] text-zinc-700">{tech}</span>
                  {i < arr.length - 1 && (
                    <span className="text-zinc-800 text-xs">·</span>
                  )}
                </span>
              ),
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}