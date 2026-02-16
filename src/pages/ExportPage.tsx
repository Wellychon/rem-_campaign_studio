import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import EmptyState from '@/components/shared/EmptyState';
import { Download, FileText, FileSpreadsheet, Database, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

export default function ExportPage() {
  const { results, campaigns, audiences } = useApp();
  const [selectedResult, setSelectedResult] = useState(results[results.length - 1]?.id || '');
  const [biStatus, setBiStatus] = useState<'idle' | 'connecting' | 'done'>('idle');

  const result = results.find((r) => r.id === selectedResult);
  const camp = result ? campaigns.find((c) => c.id === result.campaign_id) : null;
  const aud = result ? audiences.find((a) => a.id === result.audience_id) : null;

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
      csv = 'twin_id,cluster_id,prob_open,prob_click,prob_unsub,prob_spam,best_hour,device_preference,link_affinity\n';
      const rng = () => Math.random();
      for (let i = 0; i < Math.min(1000, aud.tamanho_amostra); i++) {
        const cluster = aud.distribuicao_clusters[Math.floor(rng() * aud.distribuicao_clusters.length)];
        const cl = result.por_cluster.find((c) => c.cluster_id === cluster.cluster_id);
        csv += `twin_${i.toString().padStart(5, '0')},${cluster.cluster_id},${(cl?.open_rate || 0.2).toFixed(4)},${(cl?.ctr || 0.04).toFixed(4)},${(result.kpis.unsub * (0.5 + rng())).toFixed(6)},${(result.kpis.spam * (0.5 + rng())).toFixed(6)},${Math.floor(rng() * 24)},${['mobile', 'desktop', 'tablet'][Math.floor(rng() * 3)]},${result.link_ranking[0]?.label || 'n/a'}\n`;
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
    toast({ title: 'Gerando PDF...', description: 'Abrindo prévia de impressão.' });
    window.print();
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
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
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
    </div>
  );
}
