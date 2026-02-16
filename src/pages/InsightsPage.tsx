import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import EmptyState from '@/components/shared/EmptyState';
import { Lightbulb, Filter, Sparkles, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateAbVariants } from '@/lib/simulator';
import { toast } from '@/hooks/use-toast';
import type { Campaign } from '@/types';

const catLabels: Record<string, string> = { conteudo: 'Conteúdo', publico: 'Público', timing: 'Timing', abtest: 'A/B Test' };
const sevColors: Record<string, string> = { alta: 'bg-destructive/10 text-destructive', media: 'bg-warning/10 text-warning', baixa: 'bg-primary/10 text-primary' };

export default function InsightsPage() {
  const { insights, results, campaigns, addCampaign, selectedCampaignId } = useApp();
  const [catFilter, setCatFilter] = useState<string>('todos');
  const [showAb, setShowAb] = useState(false);

  const latestResult = results[results.length - 1];
  const relevantInsights = latestResult ? insights.filter((i) => i.result_id === latestResult.id) : [];
  const filtered = catFilter === 'todos' ? relevantInsights : relevantInsights.filter((i) => i.categoria === catFilter);

  const campaign = campaigns.find((c) => c.id === (latestResult?.campaign_id || selectedCampaignId));
  const abVariants = campaign ? generateAbVariants(campaign) : null;

  const saveVariant = (subject: string, cta: string) => {
    if (!campaign) return;
    const newCamp: Campaign = { ...campaign, id: `camp-${Date.now()}`, nome: `${campaign.nome} (Variante)`, subject, cta_principal: cta };
    addCampaign(newCamp);
    toast({ title: 'Variante salva!', description: `Nova campanha: ${newCamp.nome}` });
  };

  if (relevantInsights.length === 0) return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-foreground mb-6">Insights & Recomendações</h1>
      <EmptyState icon={<Lightbulb className="w-8 h-8" />} title="Sem insights ainda" description="Rode uma simulação para gerar insights acionáveis." />
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Insights & Recomendações</h1>
          <p className="text-sm text-muted-foreground">{relevantInsights.length} insight(s) para a última simulação</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-[150px] h-8 text-xs"><Filter className="w-3 h-3 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="conteudo">Conteúdo</SelectItem>
              <SelectItem value="publico">Público</SelectItem>
              <SelectItem value="timing">Timing</SelectItem>
              <SelectItem value="abtest">A/B Test</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setShowAb(!showAb)}><Sparkles className="w-4 h-4 mr-1" /> Gerador A/B</Button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.sort((a, b) => { const order = { alta: 0, media: 1, baixa: 2 }; return order[a.severidade] - order[b.severidade]; }).map((ins) => (
          <div key={ins.id} className="bg-card rounded-xl border border-border p-4 shadow-card">
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><Lightbulb className="w-4 h-4 text-warning" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={sevColors[ins.severidade]}>{ins.severidade}</Badge>
                  <Badge variant="outline">{catLabels[ins.categoria]}</Badge>
                </div>
                <p className="text-sm text-card-foreground">{ins.texto}</p>
                <p className="text-xs text-muted-foreground mt-1">📊 {ins.evidencia}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAb && abVariants && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Gerador de Variantes A/B</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Variantes de Assunto</p>
              <div className="space-y-2">
                {abVariants.subjects.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <p className="text-sm text-card-foreground">{s}</p>
                    <Button variant="ghost" size="sm" onClick={() => saveVariant(s, campaign!.cta_principal)}><Save className="w-3 h-3 mr-1" /> Salvar</Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Variantes de CTA</p>
              <div className="space-y-2">
                {abVariants.ctas.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <p className="text-sm text-card-foreground">{c}</p>
                    <Button variant="ghost" size="sm" onClick={() => saveVariant(campaign!.subject, c)}><Save className="w-3 h-3 mr-1" /> Salvar</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
