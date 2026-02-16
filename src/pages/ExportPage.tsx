import { useMemo, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import EmptyState from '@/components/shared/EmptyState';
import { Download, FileText, FileSpreadsheet, Database, CheckCircle2, Loader2, LayoutGrid, BarChart3, PieChart as PieIcon, Clock, Link as LinkIcon, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

type PdfMode = 'resultados' | 'dashboard';

export default function ExportPage() {
  const { results, campaigns, audiences } = useApp();
  const [selectedResult, setSelectedResult] = useState(results[results.length - 1]?.id || '');
  const [pdfMode, setPdfMode] = useState<PdfMode>('resultados');
  const [sections, setSections] = useState({
    kpis: true,
    clusters: true,
    horarios: true,
    dispositivos: true,
    links: true,
    insights: true,
  });
  const [biStatus, setBiStatus] = useState<'idle' | 'connecting' | 'done'>('idle');
  const printRef = useRef<HTMLDivElement | null>(null);

  const result = results.find((r) => r.id === selectedResult);
  const camp = result ? campaigns.find((c) => c.id === result.campaign_id) : null;
  const aud = result ? audiences.find((a) => a.id === result.audience_id) : null;

  const dashboardAggregate = useMemo(() => {
    // Agrega KPIs das últimas 3 simulações
    const subset = results.slice(-3);
    if (subset.length === 0) return null;
    const agg = subset.reduce(
      (acc, r) => {
        acc.open_rate += r.kpis.open_rate;
        acc.ctr += r.kpis.ctr;
        acc.ctor += r.kpis.ctor;
        acc.unique_clicks += r.kpis.unique_clicks;
        return acc;
      },
      { open_rate: 0, ctr: 0, ctor: 0, unique_clicks: 0 }
    );
    return {
      count: subset.length,
      open_rate: agg.open_rate / subset.length,
      ctr: agg.ctr / subset.length,
      ctor: agg.ctor / subset.length,
      unique_clicks: Math.round(agg.unique_clicks / subset.length),
    };
  }, [results]);

  const exportCSV = (type: 'agregado' | 'microdados') => {
    if (!result || !camp || !aud) return;
    let csv = '';
    if (type === 'agregado') {
      csv = 'Metrica,Valor\n';
      csv += `Open Rate,${(result.kpis.open_rate * 100).toFixed(2)}%\n`;
      csv += `CTR,${(result.kpis.ctr * 100).toFixed(2)}%\n`;
      csv += `CTOR,${(result.kpis.ctor * 100).toFixed(2)}%\n`;
      csv += `Cliques Unicos,${result.kpis.unique_clicks}\n`;
      csv += `Unsub,${(result.kpis.unsub * 100).toFixed(4)}%\n`;
      csv += `Spam,${(result.kpis.spam * 100).toFixed(4)}%\n`;
      csv += `Deliverability,${result.deliverability_score.toFixed(0)}\n`;
      csv += `Reputacao,${result.reputacao.toFixed(0)}\n`;
      csv += `\nCluster,Open Rate,CTR\n`;
      result.por_cluster.forEach((c) => { csv += `${c.nome},${(c.open_rate * 100).toFixed(2)}%,${(c.ctr * 100).toFixed(2)}%\n`; });
      csv += `\nLink,Cliques Previstos\n`;
      result.link_ranking.forEach((l) => { csv += `${l.label},${l.clicks_previstos}\n`; });
    } else {
  csv = 'twin_id,persona_id,prob_open,prob_click,prob_unsub,prob_spam,best_hour,device_preference,link_affinity,confidence_score\n';
      const rng = () => Math.random();
      for (let i = 0; i < Math.min(1000, aud.tamanho_amostra); i++) {
        const cluster = aud.distribuicao_clusters[Math.floor(rng() * aud.distribuicao_clusters.length)];
        const cl = result.por_cluster.find((c) => c.cluster_id === cluster.cluster_id);
        const confidence = (0.7 + rng() * 0.3).toFixed(3);
  csv += `twin_${i.toString().padStart(5, '0')},${cluster.cluster_id},${(cl?.open_rate || 0.2).toFixed(4)},${(cl?.ctr || 0.04).toFixed(4)},${(result.kpis.unsub * (0.5 + rng())).toFixed(6)},${(result.kpis.spam * (0.5 + rng())).toFixed(6)},${Math.floor(rng() * 24)},${['mobile', 'desktop', 'tablet'][Math.floor(rng() * 3)]},${result.link_ranking[0]?.label || 'n/a'},${confidence}\n`;
      }
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `twinsim-${type}-${camp?.nome?.replace(/\s/g, '_') || 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'CSV exportado!', description: `Arquivo ${type} baixado com sucesso.` });
  };

  const exportPDF = () => {
    if (pdfMode === 'resultados' && !result) {
      toast({ title: 'Selecione um resultado', description: 'Escolha a simulação a exportar.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Gerando PDF...', description: 'Usando impressão do navegador (mock frontend-only).' });
    // Foca na área de impressão
    const el = printRef.current;
    if (el) {
      // Pequeno delay para garantir renderização
      setTimeout(() => window.print(), 100);
    } else {
      window.print();
    }
  };

  const connectBI = (dest: string) => {
    setBiStatus('connecting');
    setTimeout(() => {
      setBiStatus('done');
      toast({ title: `Conectado a ${dest}!`, description: 'Dados enviados com sucesso (mock).' });
      setTimeout(() => setBiStatus('idle'), 2000);
    }, 3000);
  };

  if (results.length === 0) return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-foreground mb-6">Exportar</h1>
      <EmptyState icon={<Download className="w-8 h-8" />} title="Nada para exportar" description="Rode uma simulação para ter dados disponíveis." />
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Exportar Dados</h1>
        <p className="text-sm text-muted-foreground">Exporte resultados em CSV, PDF ou envie para BI</p>
        <div className="mt-2"><Badge variant="outline">frontend-only • dados simulados</Badge></div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-card-foreground mb-2 block">Modo de Exportação</label>
            <Select value={pdfMode} onValueChange={(v: any) => setPdfMode(v)}>
              <SelectTrigger className="w-full max-w-md"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="resultados"><BarChart3 className="w-3 h-3 mr-1" /> Resultados (por simulação)</SelectItem>
                <SelectItem value="dashboard"><LayoutGrid className="w-3 h-3 mr-1" /> Dashboard (agregado)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {pdfMode === 'resultados' && (
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">Selecionar Resultado</label>
              <Select value={selectedResult} onValueChange={setSelectedResult}>
                <SelectTrigger className="w-full max-w-md"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {results.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{campaigns.find((c) => c.id === r.campaign_id)?.nome} • {new Date(r.created_at).toLocaleDateString('pt-BR')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground mb-2 block">Seções do PDF</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={sections.kpis} onCheckedChange={(v) => setSections((s) => ({ ...s, kpis: !!v }))} /> KPIs</label>
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={sections.clusters} onCheckedChange={(v) => setSections((s) => ({ ...s, clusters: !!v }))} /> Personas/Clusters</label>
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={sections.horarios} onCheckedChange={(v) => setSections((s) => ({ ...s, horarios: !!v }))} /> Horários</label>
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={sections.dispositivos} onCheckedChange={(v) => setSections((s) => ({ ...s, dispositivos: !!v }))} /> Dispositivos</label>
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={sections.links} onCheckedChange={(v) => setSections((s) => ({ ...s, links: !!v }))} /> Ranking de Links</label>
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={sections.insights} onCheckedChange={(v) => setSections((s) => ({ ...s, insights: !!v }))} /> Insights</label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Dica: selecione apenas o que precisa para configurar a campanha real.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-card rounded-xl border border-border p-5 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><FileSpreadsheet className="w-5 h-5 text-success" /></div>
          <h3 className="text-sm font-semibold text-card-foreground">Exportar CSV</h3>
          <p className="text-xs text-muted-foreground">Dados tabulares para análise</p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => exportCSV('agregado')}>Agregado (KPIs + Clusters)</Button>
            <Button variant="outline" size="sm" className="w-full" onClick={() => exportCSV('microdados')}>Microdados (por Gêmeo)</Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center"><FileText className="w-5 h-5 text-destructive" /></div>
          <h3 className="text-sm font-semibold text-card-foreground">Exportar PDF</h3>
          <p className="text-xs text-muted-foreground">Relatório para apresentação</p>
          <Button variant="outline" size="sm" className="w-full" onClick={exportPDF}>Gerar & Baixar PDF</Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Database className="w-5 h-5 text-primary" /></div>
          <h3 className="text-sm font-semibold text-card-foreground">Enviar para BI</h3>
          <p className="text-xs text-muted-foreground">Integração com ferramentas de BI</p>
          <Dialog>
            <DialogTrigger asChild><Button variant="outline" size="sm" className="w-full">Configurar Destino</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Enviar para BI</DialogTitle></DialogHeader>
              <div className="space-y-3">
                {['BigQuery', 'Snowflake', 'Looker'].map((dest) => (
                  <Button key={dest} variant="outline" className="w-full justify-between" onClick={() => connectBI(dest)} disabled={biStatus === 'connecting'}>
                    {dest}
                    {biStatus === 'connecting' ? <Loader2 className="w-4 h-4 animate-spin" /> : biStatus === 'done' ? <CheckCircle2 className="w-4 h-4 text-success" /> : null}
                  </Button>
                ))}
                <p className="text-xs text-muted-foreground text-center">Conexão simulada para demo</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Prévia & Área de Impressão */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Prévia</h3>
        <div id="print-area" ref={printRef} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pdfMode === 'dashboard' ? <LayoutGrid className="w-4 h-4 text-primary" /> : <BarChart3 className="w-4 h-4 text-primary" />}
              <p className="text-sm font-medium text-card-foreground">{pdfMode === 'dashboard' ? 'Dashboard (Agregado)' : `Resultados — ${camp?.nome || ''}`}</p>
            </div>
            <Badge variant="outline">Simulado • frontend-only</Badge>
          </div>

          {pdfMode === 'dashboard' && dashboardAggregate && sections.kpis && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">Open Rate médio</p><p className="text-sm font-semibold">{(dashboardAggregate.open_rate * 100).toFixed(1)}%</p></div>
              <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">CTR médio</p><p className="text-sm font-semibold">{(dashboardAggregate.ctr * 100).toFixed(2)}%</p></div>
              <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">CTOR médio</p><p className="text-sm font-semibold">{(dashboardAggregate.ctor * 100).toFixed(1)}%</p></div>
              <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">Cliques únicos</p><p className="text-sm font-semibold">{dashboardAggregate.unique_clicks.toLocaleString('pt-BR')}</p></div>
            </div>
          )}

          {pdfMode === 'resultados' && result && (
            <div className="space-y-4">
              {sections.kpis && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">Open Rate</p><p className="text-sm font-semibold">{(result.kpis.open_rate * 100).toFixed(1)}%</p></div>
                  <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">CTR</p><p className="text-sm font-semibold">{(result.kpis.ctr * 100).toFixed(2)}%</p></div>
                  <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">CTOR</p><p className="text-sm font-semibold">{(result.kpis.ctor * 100).toFixed(1)}%</p></div>
                  <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground">Cliques únicos</p><p className="text-sm font-semibold">{result.kpis.unique_clicks.toLocaleString('pt-BR')}</p></div>
                </div>
              )}

              {sections.clusters && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><PieIcon className="w-4 h-4 text-muted-foreground" /><p className="text-xs font-medium text-muted-foreground uppercase">Desempenho por Persona/Cluster</p></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.por_cluster.map((c) => (
                      <div key={c.cluster_id} className="p-2 rounded-lg bg-muted/40 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{c.nome}</p>
                          <p className="text-[11px] text-muted-foreground">Open {(c.open_rate * 100).toFixed(1)}% • CTR {(c.ctr * 100).toFixed(2)}%</p>
                        </div>
                        <Badge variant="outline">Risco {(c.unsub * 100).toFixed(2)}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sections.horarios && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-muted-foreground" /><p className="text-xs font-medium text-muted-foreground uppercase">Melhores horários</p></div>
                  <div className="grid grid-cols-3 gap-2">
                    {result.por_horario.slice(8, 14).map((h) => (
                      <div key={h.hora} className="p-2 rounded-lg bg-muted/40 text-center">
                        <p className="text-xs text-muted-foreground">{h.hora}h</p>
                        <p className="text-sm font-semibold text-card-foreground">{(h.open_rate * 100).toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sections.dispositivos && (
                <div className="grid grid-cols-3 gap-2">
                  {result.device_split.map((d) => (
                    <div key={d.device} className="p-2 rounded-lg bg-muted/40 text-center">
                      <p className="text-xs text-muted-foreground">{d.device}</p>
                      <p className="text-sm font-semibold text-card-foreground">{(d.pct * 100).toFixed(1)}%</p>
                    </div>
                  ))}
                </div>
              )}

              {sections.links && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><LinkIcon className="w-4 h-4 text-muted-foreground" /><p className="text-xs font-medium text-muted-foreground uppercase">Ranking de Links</p></div>
                  <div className="space-y-1">
                    {result.link_ranking.map((l, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                        <p className="text-sm text-card-foreground">{l.label}</p>
                        <p className="text-sm font-semibold text-primary">{l.clicks_previstos.toLocaleString('pt-BR')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sections.insights && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><Inbox className="w-4 h-4 text-muted-foreground" /><p className="text-xs font-medium text-muted-foreground uppercase">Insights</p></div>
                  <p className="text-xs text-muted-foreground">Ex.: Esse público é mais ativo perto do Natal e do 13º (mock IA).</p>
                </div>
              )}
            </div>
          )}
        </div>
        <style>{`
          @media print {
            body * { visibility: hidden; }
            #print-area, #print-area * { visibility: visible; }
            #print-area { position: absolute; left: 0; top: 0; width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}
