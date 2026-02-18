import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, GitCompareArrows, Trophy } from 'lucide-react';
import { simulate, generateAbVariants } from '@/lib/simulator';

export default function AbTests() {
  const { campaigns, audiences, selectedCampaignId, selectedAudienceId, selectCampaign, selectAudience } = useApp();
  const [variantA, setVariantA] = useState<{ subject: string; cta: string }>({ subject: '', cta: '' });
  const [variantB, setVariantB] = useState<{ subject: string; cta: string }>({ subject: '', cta: '' });
  const [resA, setResA] = useState<any>(null);
  const [resB, setResB] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const campaign = campaigns.find((c) => c.id === selectedCampaignId);
  const audience = audiences.find((a) => a.id === selectedAudienceId);
  const ai = campaign ? generateAbVariants(campaign) : null;

  const applyAiVariants = () => {
    if (!ai) return;
    setVariantA({ subject: ai.subjects[0] || campaign?.subject || '', cta: ai.ctas[0] || campaign?.cta_principal || '' });
    setVariantB({ subject: ai.subjects[1] || campaign?.subject || '', cta: ai.ctas[1] || campaign?.cta_principal || '' });
  };

  const runComparison = () => {
    if (!campaign || !audience || !variantA.subject || !variantB.subject) return;
    setLoading(true);
    // Build temp campaigns
    const campA = { ...campaign, id: `${campaign.id}-A`, nome: `${campaign.nome} — Variante A`, subject: variantA.subject, cta_principal: variantA.cta || campaign.cta_principal };
    const campB = { ...campaign, id: `${campaign.id}-B`, nome: `${campaign.nome} — Variante B`, subject: variantB.subject, cta_principal: variantB.cta || campaign.cta_principal };
    const { result: rA } = simulate(audience, campA);
    const { result: rB } = simulate(audience, campB);
    setResA(rA);
    setResB(rB);
    setLoading(false);
  };

  const score = (r: any) => r.kpis.open_rate * 40 + r.kpis.ctr * 30 - r.kpis.unsub * 1000 - r.kpis.spam * 5000 + r.deliverability_score * 0.1;
  const winner = resA && resB ? (score(resA) >= score(resB) ? 'A' : 'B') : null;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Testes A/B</h1>
        </div>
        <Badge variant="outline">frontend-only • dados simulados</Badge>
      </div>
      <p className="text-sm text-muted-foreground">Gere variantes por IA e compare resultados lado a lado.</p>

      <div className="bg-card rounded-xl border border-border p-5 shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Campanha Base</label>
            <Select value={selectedCampaignId || ''} onValueChange={selectCampaign}>
              <SelectTrigger><SelectValue placeholder="Selecionar campanha" /></SelectTrigger>
              <SelectContent>{campaigns.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Público</label>
            <Select value={selectedAudienceId || ''} onValueChange={selectAudience}>
              <SelectTrigger><SelectValue placeholder="Selecionar público" /></SelectTrigger>
              <SelectContent>{audiences.map((a) => <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {campaign && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={applyAiVariants}><Sparkles className="w-4 h-4 mr-1" /> Gerar variantes por IA</Button>
              <span className="text-[11px] text-muted-foreground">Sugestões baseadas em conteúdo e CTA</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs font-semibold text-card-foreground mb-2">Variante A</p>
                <div className="space-y-2">
                  <Input value={variantA.subject} onChange={(e) => setVariantA((v) => ({ ...v, subject: e.target.value }))} placeholder="Assunto (A)" />
                  <Input value={variantA.cta} onChange={(e) => setVariantA((v) => ({ ...v, cta: e.target.value }))} placeholder="CTA (A)" />
                </div>
              </div>
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs font-semibold text-card-foreground mb-2">Variante B</p>
                <div className="space-y-2">
                  <Input value={variantB.subject} onChange={(e) => setVariantB((v) => ({ ...v, subject: e.target.value }))} placeholder="Assunto (B)" />
                  <Input value={variantB.cta} onChange={(e) => setVariantB((v) => ({ ...v, cta: e.target.value }))} placeholder="CTA (B)" />
                </div>
              </div>
            </div>
            <Button className="w-full" disabled={!audience || !campaign || loading || !variantA.subject || !variantB.subject} onClick={runComparison}>
              <GitCompareArrows className="w-4 h-4 mr-1" /> {loading ? 'Comparando...' : 'Rodar comparação A vs B'}
            </Button>
          </div>
        )}
      </div>

      {resA && resB && (
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Métrica</th>
                  <th className="text-center px-4 py-3 font-medium text-card-foreground">Variante A {winner === 'A' && <Trophy className="w-3 h-3 inline ml-1 text-warning" />}</th>
                  <th className="text-center px-4 py-3 font-medium text-card-foreground">Variante B {winner === 'B' && <Trophy className="w-3 h-3 inline ml-1 text-warning" />}</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ['Open Rate', (r: any) => `${(r.kpis.open_rate * 100).toFixed(1)}%`],
                  ['CTR', (r: any) => `${(r.kpis.ctr * 100).toFixed(2)}%`],
                  ['CTOR', (r: any) => `${(r.kpis.ctor * 100).toFixed(1)}%`],
                  ['Cliques Únicos', (r: any) => r.kpis.unique_clicks.toLocaleString('pt-BR')],
                  ['Unsub', (r: any) => `${(r.kpis.unsub * 100).toFixed(3)}%`],
                  ['Spam', (r: any) => `${(r.kpis.spam * 100).toFixed(4)}%`],
                  ['Deliverability', (r: any) => `${r.deliverability_score.toFixed(0)}/100`],
                  ['Reputação', (r: any) => `${r.reputacao.toFixed(0)}/100`],
                ] as [string, (r: any) => string][]).map(([label, fn]) => (
                  <tr key={label} className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium text-card-foreground">{label}</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">{fn(resA)}</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">{fn(resB)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
