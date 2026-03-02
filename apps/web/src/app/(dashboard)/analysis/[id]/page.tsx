'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { analysisApi, type FileAnalysis, type Issue } from '@/lib/api/analysis.api';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useEffect } from 'react';

// ── Score Ring ────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute -rotate-90" width="144" height="144">
          <circle cx="72" cy="72" r={r} stroke="#1a1a1a" strokeWidth="10" fill="none" />
          <circle
            cx="72" cy="72" r={r}
            stroke={color} strokeWidth="10" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="text-center">
          <div className="text-4xl font-black text-white" style={{ fontFamily: 'var(--font-syne)' }}>
            {score}
          </div>
          <div className="text-xs font-mono text-zinc-500">/100</div>
        </div>
      </div>
      <span className="text-sm font-mono px-3 py-1 rounded-full border"
        style={{ color, borderColor: `${color}30`, background: `${color}10` }}>
        {label}
      </span>
    </div>
  );
}

// ── Severity Badge ────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: Issue['severity'] }) {
  const styles = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    suggestion: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }[severity];

  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${styles} shrink-0`}>
      {severity}
    </span>
  );
}

// ── File Card ─────────────────────────────────────────────────
function FileCard({ file }: { file: FileAnalysis }) {
  const criticalCount = file.issues.filter((i) => i.severity === 'critical').length;
  const warningCount = file.issues.filter((i) => i.severity === 'warning').length;
  const suggestionCount = file.issues.filter((i) => i.severity === 'suggestion').length;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      {/* File Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
        <span className="font-mono text-sm text-green-400 truncate">{file.filename}</span>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {criticalCount > 0 && (
            <span className="text-xs font-mono text-red-400">{criticalCount} critical</span>
          )}
          {warningCount > 0 && (
            <span className="text-xs font-mono text-yellow-400">{warningCount} warning</span>
          )}
          {suggestionCount > 0 && (
            <span className="text-xs font-mono text-blue-400">{suggestionCount} suggestion</span>
          )}
        </div>
      </div>

      {/* File Summary */}
      <div className="px-5 py-3 border-b border-zinc-800/50">
        <p className="text-zinc-400 text-sm">{file.summary}</p>
      </div>

      {/* Issues */}
      {file.issues.length === 0 ? (
        <div className="px-5 py-4 text-zinc-600 text-sm font-mono">
          ✓ No issues found
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/50">
          {file.issues.map((issue, i) => (
            <div key={i} className="px-5 py-3 flex items-start gap-3">
              <SeverityBadge severity={issue.severity} />
              <span className="text-zinc-300 text-sm leading-relaxed">{issue.message}</span>
              {issue.line && (
                <span className="text-zinc-600 text-xs font-mono shrink-0 mt-0.5">
                  L{issue.line}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Loading Skeleton ──────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-36 h-36 rounded-full bg-zinc-900" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48 bg-zinc-900" />
          <Skeleton className="h-4 w-full bg-zinc-900" />
          <Skeleton className="h-4 w-3/4 bg-zinc-900" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-40 w-full bg-zinc-900 rounded-xl" />
      ))}
    </div>
  );
}

// ── Processing State ──────────────────────────────────────────
function ProcessingState({ status }: { status: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-2 border-t-green-500 animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-white font-mono text-sm mb-1">
          {status === 'PENDING' ? 'Queued for analysis...' : 'Analyzing your code...'}
        </p>
        <p className="text-zinc-600 text-xs font-mono">
          This usually takes 10-30 seconds
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => analysisApi.getById(id),
    // Why refetchInterval? Poll every 3s while job is running,
    // stop automatically once it's COMPLETED or FAILED
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'COMPLETED' || status === 'FAILED') return false;
      return 3000;
    },
  });

  // Show toast when analysis completes
  useEffect(() => {
    if (analysis?.status === 'COMPLETED') {
      toast.success('Analysis complete!', {
        description: `Score: ${analysis.overallScore}/100`,
      });
    }
    if (analysis?.status === 'FAILED') {
      toast.error('Analysis failed', {
        description: 'Something went wrong. Please try again.',
      });
    }
  }, [analysis?.status]);

  const result = analysis?.result;

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-sm mb-8 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Dashboard
      </button>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1"
          style={{ fontFamily: 'var(--font-syne)' }}>
          {analysis?.repoName ?? 'Loading...'}
        </h1>
        <p className="text-zinc-600 text-xs font-mono truncate">
          {analysis?.prUrl}
        </p>
      </div>

      {/* Content */}
      {isLoading && <LoadingSkeleton />}

      {!isLoading && (analysis?.status === 'PENDING' || analysis?.status === 'PROCESSING') && (
        <ProcessingState status={analysis.status} />
      )}

      {!isLoading && analysis?.status === 'FAILED' && (
        <div className="text-center py-24">
          <p className="text-red-400 font-mono text-sm mb-4">Analysis failed</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-zinc-500 hover:text-white text-sm font-mono transition-colors"
          >
            ← Try another PR
          </button>
        </div>
      )}

      {!isLoading && analysis?.status === 'COMPLETED' && result && (
        <div className="space-y-8">
          {/* Score + Summary */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
            <ScoreRing score={result.overallScore} />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
                Overall Summary
              </h2>
              <p className="text-zinc-300 leading-relaxed">{result.summary}</p>
              <div className="flex gap-6 mt-6 justify-center md:justify-start">
                {[
                  { label: 'Files Reviewed', val: result.files.length },
                  { label: 'Total Issues', val: result.files.reduce((acc, f) => acc + f.issues.length, 0) },
                  { label: 'Critical', val: result.files.reduce((acc, f) => acc + f.issues.filter(i => i.severity === 'critical').length, 0) },
                ].map(({ label, val }) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-black text-white">{val}</div>
                    <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Files */}
          <div>
            <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
              File Analysis
            </h2>
            <div className="space-y-4">
              {result.files.map((file) => (
                <FileCard key={file.filename} file={file} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}