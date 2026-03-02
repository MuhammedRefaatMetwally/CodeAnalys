interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
}

export function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 bg-zinc-900/60 rounded-lg border border-zinc-800 min-w-[90px]">
      <span
        className="text-2xl font-bold leading-none"
        style={{ color: accent ?? 'white' }}
      >
        {value}
      </span>
      <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}