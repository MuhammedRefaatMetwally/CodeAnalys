import type { Issue } from '@/lib/api/analysis.api';

interface SeverityBadgeProps {
  severity: Issue['severity'];
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const styles = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning:  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    suggestion: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }[severity];

  return (
    <span className={`
      inline-flex items-center shrink-0
      text-xs font-mono px-2.5 py-1 rounded-full border
      ${styles}
    `}>
      {severity}
    </span>
  );
}