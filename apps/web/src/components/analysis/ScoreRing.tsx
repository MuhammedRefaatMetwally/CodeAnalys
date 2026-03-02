interface ScoreRingProps {
  score: number;
}

export function ScoreRing({ score }: ScoreRingProps) {
  const color =
    score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  const label =
    score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
        <svg className="absolute -rotate-90" width="112" height="112">
          <circle cx="56" cy="56" r={r} stroke="#1c1c1c" strokeWidth="8" fill="none" />
          <circle
            cx="56" cy="56" r={r}
            stroke={color} strokeWidth="8" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease' }}
          />
        </svg>
        <div className="text-center z-10">
          <div className="text-3xl font-bold text-white leading-none">{score}</div>
          <div className="text-xs font-mono text-zinc-600 mt-0.5">/100</div>
        </div>
      </div>
      <div>
        <span
          className="text-xs font-mono px-2.5 py-1 rounded border"
          style={{ color, borderColor: `${color}30`, background: `${color}10` }}
        >
          {label}
        </span>
        <p className="text-zinc-600 text-xs font-mono mt-2">Overall quality score</p>
      </div>
    </div>
  );
}