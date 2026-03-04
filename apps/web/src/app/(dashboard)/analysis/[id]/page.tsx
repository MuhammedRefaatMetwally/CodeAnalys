'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { analysisApi } from '@/lib/api/analysis.api';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreRing } from '@/components/analysis/ScoreRing';
import { FileCard } from '@/components/analysis/FileCard';
import { StatCard } from '@/components/analysis/StatCard';
import { ProcessingState } from '@/components/analysis/ProcessingState';

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <Skeleton className="w-40 h-40 rounded-full bg-zinc-800 shrink-0" />
        <div className="space-y-3 flex-1 w-full">
          <Skeleton className="h-4 w-32 bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-3/4 bg-zinc-800" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-16 w-28 bg-zinc-800 rounded-xl" />
            <Skeleton className="h-16 w-28 bg-zinc-800 rounded-xl" />
            <Skeleton className="h-16 w-28 bg-zinc-800 rounded-xl" />
          </div>
        </div>
      </div>
      {[1, 2].map((i) => (
        <Skeleton key={i} className="h-48 w-full bg-zinc-900 rounded-xl" />
      ))}
    </div>
  );
}

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => analysisApi.getById(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'COMPLETED' || status === 'FAILED') return false;
      return 3000;
    },
  });

  useEffect(() => {
    if (analysis?.status === 'COMPLETED') {
      toast.success('Analysis complete!', {
        description: `Overall score: ${analysis.overallScore}/100`,
      });
    }
    if (analysis?.status === 'FAILED') {
      toast.error('Analysis failed', {
        description: 'Something went wrong processing this PR.',
      });
    }
  }, [analysis?.status]);

  const result = analysis?.result;

  const totalIssues = result?.files.reduce((acc, f) => acc + f.issues.length, 0) ?? 0;
  const criticalIssues = result?.files.reduce(
    (acc, f) => acc + f.issues.filter((i) => i.severity === 'critical').length, 0
  ) ?? 0;

  return (
    <div className="space-y-8">
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-sm group"
      >
        <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
        Back to Dashboard
      </button>

      <div className="space-y-1">
        <h1
          className="text-2xl sm:text-3xl font-black text-white break-words"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          {analysis?.repoName ?? 'Loading...'}
        </h1>
        <p className="text-zinc-600 text-xs font-mono break-all">
          {analysis?.prUrl}
        </p>
      </div>

      {isLoading && <LoadingSkeleton />}

      {!isLoading &&
        (analysis?.status === 'PENDING' || analysis?.status === 'PROCESSING') && (
          <ProcessingState status={analysis.status} />
        )}

      {!isLoading && analysis?.status === 'FAILED' && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-red-400 font-mono text-sm">Analysis failed</p>
          <p className="text-zinc-600 text-xs font-mono text-center max-w-sm">
            This can happen if the PR is private, the URL is invalid, or Gemini returned an unexpected response.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-zinc-500 hover:text-white text-sm font-mono transition-colors mt-2"
          >
            ← Try another PR
          </button>
        </div>
      )}

      {!isLoading && analysis?.status === 'COMPLETED' && result && (
        <div className="space-y-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                <ScoreRing score={result.overallScore} />
              </div>

              <div className="hidden md:block w-px self-stretch bg-zinc-800" />

              <div className="flex-1 space-y-6 text-center md:text-left">
                <div>
                  <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
                    Overall Summary
                  </p>
                  <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                    {result.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <StatCard
                    label="Files Reviewed"
                    value={result.files.length}
                  />
                  <StatCard
                    label="Total Issues"
                    value={totalIssues}
                    accent={totalIssues > 10 ? '#ef4444' : '#22c55e'}
                  />
                  <StatCard
                    label="Critical"
                    value={criticalIssues}
                    accent={criticalIssues > 0 ? '#ef4444' : '#22c55e'}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              File Analysis — {result.files.length} files reviewed
            </p>
            {result.files.map((file) => (
              <FileCard key={file.filename} file={file} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}