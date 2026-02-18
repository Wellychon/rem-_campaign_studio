import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'approved' | 'rejected' | 'neutral' | 'confidence';

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

const toneStyles: Record<BadgeTone, string> = {
  approved: 'bg-green-50 text-green-700 border-green-100',
  rejected: 'bg-orange-50 text-orange-700 border-orange-100',
  neutral: 'bg-secondary text-textSecondary border-border',
  confidence: 'bg-[#EFF6FF] text-brand border-[#DBEAFE]',
};

export default function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-200',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
