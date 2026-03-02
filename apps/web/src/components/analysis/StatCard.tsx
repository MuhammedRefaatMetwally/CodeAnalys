interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
}

export function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4 bg-zinc-800/40 rounded-xl border border-zinc-800 min-w-[100px]">
      <span
        className="text-3xl font-black leading-none"
        style={{
          fontFamily: 'var(--font-syne)',
          color: accent ?? 'white',
        }}
      >
        {value}
      </span>
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider text-center">
        {label}
      </span>
    </div>
  );
}