import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export default function KpiCard({ label, value, subtitle, icon, trend, trendValue, className }: KpiCardProps) {
  return (
    <div className={cn('bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="label">{label}</p>
          <p className="text-5xl font-bold text-textPrimary">{value}</p>
          {subtitle && <p className="text-xs text-textSecondary">{subtitle}</p>}
          {trend && trendValue && (
            <p className={cn('text-sm mt-2 font-medium', trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-textSecondary')}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        {icon && <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand shrink-0">{icon}</div>}
      </div>
    </div>
  );
}
