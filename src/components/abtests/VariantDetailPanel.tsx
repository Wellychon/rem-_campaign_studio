import { Button } from '@/components/ui/button';
import Badge from './Badge';
import type { VariantNodeData } from './types';

interface VariantDetailPanelProps {
  node: VariantNodeData | null;
  winner: VariantNodeData | null;
}

export default function VariantDetailPanel({ node, winner }: VariantDetailPanelProps) {
  if (!node) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <p className="text-sm text-textSecondary">Selecione uma variante na árvore para ver os detalhes.</p>
      </div>
    );
  }

  const approved = node.status === 'approved' || node.status === 'root';

  return (
    <div key={node.id} className="bg-card rounded-xl border border-border p-6 shadow-card space-y-5 animate-panel-in">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-card-foreground">Variante {node.name}</h3>
        {approved ? <Badge tone="approved">Aprovada</Badge> : <Badge tone="rejected">Negada</Badge>}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-secondary/60 p-3">
          <p className="text-textSecondary text-xs">Open Rate previsto</p>
          <p className="font-semibold text-card-foreground">{node.metrics.openRate.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg bg-secondary/60 p-3">
          <p className="text-textSecondary text-xs">CTR previsto</p>
          <p className="font-semibold text-card-foreground">{node.metrics.ctr.toFixed(2)}%</p>
        </div>
        <div className="rounded-lg bg-secondary/60 p-3">
          <p className="text-textSecondary text-xs">Score global</p>
          <p className="font-semibold text-card-foreground">{node.metrics.score.toFixed(1)}</p>
        </div>
        <div className="rounded-lg bg-secondary/60 p-3">
          <p className="text-textSecondary text-xs">Confiança</p>
          <p className="font-semibold text-card-foreground">{node.metrics.confidence}%</p>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-textSecondary">Público</p>
        <p className="text-sm text-card-foreground mt-1">{node.audienceName}</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-textSecondary">Alterações aplicadas</p>
        <ul className="mt-1 space-y-1 text-sm text-card-foreground">
          {node.alterations.map((change, i) => (
            <li key={i}>• {change}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-textSecondary">Justificativa</p>
        <ul className="mt-1 space-y-1 text-sm text-card-foreground">
          <li>• {node.reason}</li>
          {approved ? <li>• Variante superou a alternativa na mesma rodada.</li> : <li>• Variante ficou abaixo da vencedora na rodada.</li>}
        </ul>
      </div>

      <Button variant="outline" className="w-full" disabled={!winner || winner.id === node.id}>
        Comparar com vencedora
      </Button>
    </div>
  );
}
