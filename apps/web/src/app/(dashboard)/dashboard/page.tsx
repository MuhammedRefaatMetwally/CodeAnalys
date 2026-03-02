    'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { analysisApi } from '@/lib/api/analysis.api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    PROCESSING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    COMPLETED: 'bg-green-500/10 text-green-400 border-green-500/20',
    FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
  }[status] ?? 'bg-zinc-500/10 text-zinc-400';

  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${styles}`}>
      {status}
    </span>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  const r = 20;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute -rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={r} stroke="#1f1f1f" strokeWidth="4" fill="none" />
        <circle
          cx="28" cy="28" r={r}
          stroke={color} strokeWidth="4" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span className="text-xs font-mono font-bold text-white">{score}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [prUrl, setPrUrl] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: analyses, isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: analysisApi.getAll,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      const hasPending = data.some(
        (a) => a.status === 'PENDING' || a.status === 'PROCESSING',
      );
      return hasPending ? 3000 : false;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => analysisApi.create(prUrl),
    onSuccess: (data) => {
      setPrUrl('');
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
      toast.success('Analysis started!', {
        description: 'Your PR is being analyzed. Results will appear shortly.',
      });
      router.push(`/analysis/${data.id}`);
    },
    onError: () => {
      toast.error('Failed to start analysis', {
        description: 'Make sure the PR URL is valid and public.',
      });
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-1"
          style={{ fontFamily: 'var(--font-syne)' }}>
          Code Review
        </h1>
        <p className="text-zinc-500 text-sm">Paste a GitHub PR URL to get instant AI feedback</p>
      </div>

      {/* Submit Form */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-10">
        <div className="flex gap-3">
          <Input
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            placeholder="https://github.com/owner/repo/pull/123"
            className="flex-1 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-green-500 font-mono text-sm"
          />
          <Button
            onClick={() => mutate()}
            disabled={isPending || !prUrl.trim()}
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 shrink-0"
          >
            {isPending ? 'Starting...' : 'Analyze PR'}
          </Button>
        </div>
      </div>

      {/* Analyses List */}
      <div>
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
          Recent Analyses
        </h2>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full bg-zinc-900 rounded-xl" />
            ))}
          </div>
        )}

        {!isLoading && analyses?.length === 0 && (
          <div className="text-center py-16 text-zinc-600 font-mono text-sm">
            No analyses yet. Submit your first PR above.
          </div>
        )}

        <div className="space-y-3">
          {analyses?.map((analysis) => (
            <div
              key={analysis.id}
              onClick={() => router.push(`/analysis/${analysis.id}`)}
              className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 cursor-pointer transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                {analysis.status === 'COMPLETED' && analysis.overallScore !== null ? (
                  <ScoreRing score={analysis.overallScore} />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-600 border-t-green-500 animate-spin"
                      style={{ display: analysis.status === 'PENDING' || analysis.status === 'PROCESSING' ? 'block' : 'none' }}
                    />
                  </div>
                )}
                <div>
                  <div className="text-white font-mono text-sm font-medium group-hover:text-green-400 transition-colors">
                    {analysis.repoName}
                  </div>
                  <div className="text-zinc-600 text-xs mt-0.5 font-mono truncate max-w-md">
                    {analysis.prUrl}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <StatusBadge status={analysis.status} />
                <span className="text-zinc-600 text-xs font-mono">
                  {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}