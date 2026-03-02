interface ProcessingStateProps {
  status: string;
}

export function ProcessingState({ status }: ProcessingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-8">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-2 border-t-green-500 animate-spin" />
        <div className="absolute inset-3 rounded-full border border-zinc-800/50 border-t-green-500/30 animate-spin"
          style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
      </div>
      <div className="text-center space-y-2">
        <p className="text-white font-mono text-sm">
          {status === 'PENDING' ? '⏳ Queued for analysis...' : '🔍 Analyzing your code...'}
        </p>
        <p className="text-zinc-600 text-xs font-mono">
          Gemini AI is reviewing your PR — usually 10–30 seconds
        </p>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}