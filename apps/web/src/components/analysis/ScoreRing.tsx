interface ScoreRingProps {
  score: number;
}

export function ScoreRing({ score }: ScoreRingProps) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute -rotate-90" width="160" height="160">
          <circle
            cx="80" cy="80" r={r}
            stroke="#1a1a1a" strokeWidth="12" fill="none"
          />
          <circle
            cx="80" cy="80" r={r}
            stroke={color} strokeWidth="12" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease' }}
          />
        </svg>
        <div className="text-center z-10">
          <div
            className="text-5xl font-black text-white leading-none"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {score}
          </div>
          <div className="text-sm font-mono text-zinc-500 mt-1">/100</div>
        </div>
      </div>
      <span
        className="text-sm font-mono px-4 py-1.5 rounded-full border tracking-wide"
        style={{
          color,
          borderColor: `${color}40`,
          background: `${color}12`,
        }}
      >
        {label}
      </span>
    </div>
  );
}