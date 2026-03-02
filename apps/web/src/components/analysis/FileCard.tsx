import type { FileAnalysis } from '@/lib/api/analysis.api';
import { SeverityBadge } from './SeverityBadge';

interface FileCardProps {
  file: FileAnalysis;
}

export function FileCard({ file }: FileCardProps) {
  const counts = {
    critical:   file.issues.filter((i) => i.severity === 'critical').length,
    warning:    file.issues.filter((i) => i.severity === 'warning').length,
    suggestion: file.issues.filter((i) => i.severity === 'suggestion').length,
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
      {/* File Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
        <span className="font-mono text-sm text-green-400 break-all">
          {file.filename}
        </span>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {counts.critical > 0 && (
            <span className="text-xs font-mono text-red-400 whitespace-nowrap">
              {counts.critical} critical
            </span>
          )}
          {counts.warning > 0 && (
            <span className="text-xs font-mono text-yellow-400 whitespace-nowrap">
              {counts.warning} warning
            </span>
          )}
          {counts.suggestion > 0 && (
            <span className="text-xs font-mono text-blue-400 whitespace-nowrap">
              {counts.suggestion} suggestion
            </span>
          )}
          {file.issues.length === 0 && (
            <span className="text-xs font-mono text-green-500">✓ Clean</span>
          )}
        </div>
      </div>

      {/* File Summary */}
      <div className="px-5 py-4 border-b border-zinc-800/50">
        <p className="text-zinc-400 text-sm leading-relaxed">{file.summary}</p>
      </div>

      {/* Issues */}
      {file.issues.length === 0 ? (
        <div className="px-5 py-4 text-zinc-600 text-sm font-mono">
          No issues detected in this file.
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/50">
          {file.issues.map((issue, i) => (
            <div key={i} className="px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex items-center gap-3">
                <SeverityBadge severity={issue.severity} />
                {issue.line && (
                  <span className="text-zinc-600 text-xs font-mono whitespace-nowrap">
                    Line {issue.line}
                  </span>
                )}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed flex-1">
                {issue.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}