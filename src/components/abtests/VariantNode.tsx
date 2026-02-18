import { CheckCircle2, XCircle, CircleDot } from 'lucide-react';
import Badge from './Badge';
import { cn } from '@/lib/utils';
import type { VariantNodeData } from './types';

interface VariantNodeProps {
  node: VariantNodeData;
  selected: boolean;
  onClick: (id: string) => void;
  showConnector?: boolean;
  animateConnector?: boolean;
  isFresh?: boolean;
  isHighlighted?: boolean;
}

export default function VariantNode({
  node,
  selected,
  onClick,
  showConnector,
  animateConnector,
  isFresh,
  isHighlighted,
}: VariantNodeProps) {
  const isApproved = node.status === 'approved' || node.status === 'root';
  const isRejected = node.status === 'rejected';

  return (
    <div className="flex flex-col items-center">
      {showConnector ? (
        <div
          className={cn(
            'h-5 border-l origin-top',
            isRejected ? 'border-dashed border-orange-300' : 'border-solid border-border',
            animateConnector ? 'animate-line-draw' : '',
          )}
        />
      ) : null}

      <button
        type="button"
        data-variant-id={node.id}
        onClick={() => onClick(node.id)}
        className={cn(
          'w-full rounded-xl border p-4 text-left transition-all duration-300 bg-card',
          isApproved ? 'border-brand/70 bg-brand/5' : 'border-border',
          isRejected ? 'opacity-40 border-dashed' : 'opacity-100',
          node.status === 'candidate' ? 'opacity-90' : '',
          selected ? 'ring-2 ring-brand/30' : 'ring-0',
          isFresh ? 'animate-node-in' : '',
          isHighlighted ? 'ring-2 ring-brand/45 shadow-[0_0_0_2px_rgba(37,99,235,0.22)]' : '',
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-card-foreground">{node.name}</p>
          {node.status === 'approved' || node.status === 'root' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : node.status === 'rejected' ? (
            <XCircle className="w-4 h-4 text-orange-600" />
          ) : (
            <CircleDot className="w-4 h-4 text-brand" />
          )}
        </div>

        <div className="mt-2 flex items-center gap-2">
          {node.status === 'approved' || node.status === 'root' ? (
            <Badge tone="approved">Aprovada</Badge>
          ) : node.status === 'rejected' ? (
            <Badge tone="rejected">Negada</Badge>
          ) : (
            <Badge tone="neutral">Avaliando</Badge>
          )}
          <Badge tone="confidence">Confiança {node.metrics.confidence}%</Badge>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md bg-secondary/60 px-2 py-1.5">
            <p className="text-textSecondary">Open</p>
            <p className="font-semibold text-card-foreground">{node.metrics.openRate.toFixed(1)}%</p>
          </div>
          <div className="rounded-md bg-secondary/60 px-2 py-1.5">
            <p className="text-textSecondary">CTR</p>
            <p className="font-semibold text-card-foreground">{node.metrics.ctr.toFixed(2)}%</p>
          </div>
        </div>
      </button>
    </div>
  );
}
