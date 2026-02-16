import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import EmptyState from '@/components/shared/EmptyState';
import { GitCompareArrows, Trophy, AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

export default function ComparePage() {
  const { results, campaigns, audiences } = useApp();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : s.length < 4 ? [...s, id] : s);

  const compared = results.filter((r) => selected.includes(r.id));

  // Heuristic: weighted score (higher is better)
  const score = (r: typeof results[0]) => r.kpis.open_rate * 40 + r.kpis.ctr * 30 - r.kpis.unsub * 1000 - r.kpis.spam * 5000 + r.deliverability_score * 0.1;
  const winner = compared.length >= 2 ? compared.reduce((b, r) => score(r) > score(b) ? r : b) : null;

  if (results.length === 0) return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-foreground mb-6">Comparar Campanhas</h1>
      <EmptyState icon={<GitCompareArrows className="w-8 h-8" />} title="Sem resultados para comparar" description="Rode ao menos 2 simulações para comparar campanhas." />
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Comparar Campanhas</h1>
        <p className="text-sm text-muted-foreground">Selecione 2–4 simulações para comparar lado a lado</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Selecionar Resultados</h3>
        <div className="space-y-2">
          {results.map((r) => {
            const camp = campaigns.find((c) => c.id === r.campaign_id);
            const aud = audiences.find((a) => a.id === r.audience_id);
            return (
              <label key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggle(r.id)} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{camp?.nome}</p>
                  <p className="text-xs text-muted-foreground">{aud?.nome} • {new Date(r.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className="text-sm font-medium text-primary">{(r.kpis.open_rate * 100).toFixed(1)}%</span>
              </label>
            );
          })}
        </div>
      </div>

      {compared.length >= 2 && (
        <>
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Métrica</th>
                    {compared.map((r) => (
                      <th key={r.id} className="text-center px-4 py-3 font-medium text-card-foreground">
                        {campaigns.find((c) => c.id === r.campaign_id)?.nome?.slice(0, 25)}
                        {winner?.id === r.id && <Trophy className="w-3 h-3 inline ml-1 text-warning" />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    ['Open Rate', (r: typeof results[0]) => `${(r.kpis.open_rate * 100).toFixed(1)}%`],
                    ['CTR', (r: typeof results[0]) => `${(r.kpis.ctr * 100).toFixed(2)}%`],
                    ['CTOR', (r: typeof results[0]) => `${(r.kpis.ctor * 100).toFixed(1)}%`],
                    ['Cliques Únicos', (r: typeof results[0]) => r.kpis.unique_clicks.toLocaleString('pt-BR')],
                    ['Unsub', (r: typeof results[0]) => `${(r.kpis.unsub * 100).toFixed(3)}%`],
                    ['Spam', (r: typeof results[0]) => `${(r.kpis.spam * 100).toFixed(4)}%`],
                    ['Deliverability', (r: typeof results[0]) => `${r.deliverability_score.toFixed(0)}/100`],
                    ['Reputação', (r: typeof results[0]) => `${r.reputacao.toFixed(0)}/100`],
                  ] as [string, (r: typeof results[0]) => string][]).map(([label, fn]) => (
                    <tr key={label} className="border-b border-border">
                      <td className="px-4 py-2.5 font-medium text-card-foreground">{label}</td>
                      {compared.map((r) => <td key={r.id} className="px-4 py-2.5 text-center text-muted-foreground">{fn(r)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {winner && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm font-semibold text-card-foreground">Recomendação: {campaigns.find((c) => c.id === winner.campaign_id)?.nome}</p>
                <p className="text-xs text-muted-foreground">Melhor equilíbrio entre engajamento e risco de reputação (heurística ponderada).</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
