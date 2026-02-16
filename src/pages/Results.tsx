import { useApp } from '@/context/AppContext';
import { useParams } from 'react-router-dom';
import KpiCard from '@/components/shared/KpiCard';
import EmptyState from '@/components/shared/EmptyState';
import { BarChart3, Eye, MousePointerClick, UserMinus, ShieldAlert, Monitor, Smartphone, Tablet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function Results() {
  const { results, audiences, campaigns, getInsightsForResult } = useApp();
  const { id } = useParams();
  const result = id ? results.find((r) => r.id === id) : results[results.length - 1];

  if (!result) return <EmptyState icon={<BarChart3 className="w-8 h-8" />} title="Nenhum resultado" description="Rode uma simulação primeiro para ver os resultados." />;

  const aud = audiences.find((a) => a.id === result.audience_id);
  const camp = campaigns.find((c) => c.id === result.campaign_id);
  const { kpis } = result;

  const histData = result.hist_open_propensity.map((v, i) => ({ faixa: `${i * 10}-${(i + 1) * 10}%`, valor: +(v * 100).toFixed(1) }));
  const clusterData = result.por_cluster.map((c) => ({ nome: c.nome, 'Open Rate': +(c.open_rate * 100).toFixed(1), CTR: +(c.ctr * 100).toFixed(2) }));
  const horarioData = result.por_horario.map((h) => ({ hora: `${h.hora}h`, open: +(h.open_rate * 100).toFixed(1), ctr: +(h.ctr * 100).toFixed(2) }));
  const deviceData = result.device_split.map((d) => ({ name: d.device, value: +(d.pct * 100).toFixed(1) }));

  // Heatmap: aggregate by day
  const heatmapByDay = DIAS.map((dia, d) => {
    const cells = result.heatmap_open_time.filter((c) => c.dia === d);
    const peak = cells.reduce((b, c) => (c.valor > b.valor ? c : b), cells[0]);
    return { dia, peakHora: peak?.hora || 0, peakVal: peak?.valor || 0 };
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resultados da Simulação</h1>
        <p className="text-sm text-muted-foreground">{camp?.nome} → {aud?.nome} • {new Date(result.created_at).toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Open Rate" value={`${(kpis.open_rate * 100).toFixed(1)}%`} icon={<Eye className="w-5 h-5" />} trend={kpis.open_rate > 0.2 ? 'up' : 'down'} trendValue={kpis.open_rate > 0.2 ? 'Bom' : 'Abaixo'} />
        <KpiCard label="CTR" value={`${(kpis.ctr * 100).toFixed(2)}%`} icon={<MousePointerClick className="w-5 h-5" />} />
        <KpiCard label="CTOR" value={`${(kpis.ctor * 100).toFixed(1)}%`} subtitle="Click-to-Open" />
        <KpiCard label="Cliques Únicos" value={kpis.unique_clicks.toLocaleString('pt-BR')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Histograma — Propensão de Abertura</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={histData}><XAxis dataKey="faixa" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="valor" fill="#3B82F6" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Desempenho por Cluster</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={clusterData}><XAxis dataKey="nome" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Legend /><Bar dataKey="Open Rate" fill="#3B82F6" radius={[4, 4, 0, 0]} /><Bar dataKey="CTR" fill="#8B5CF6" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Variação por Horário</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={horarioData}><XAxis dataKey="hora" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="open" stroke="#3B82F6" strokeWidth={2} name="Open %" dot={false} /><Line type="monotone" dataKey="ctr" stroke="#8B5CF6" strokeWidth={2} name="CTR %" dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Dispositivos</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={3} label={({ name, value }) => `${name}: ${value}%`}>{deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Heatmap — Melhor Hora por Dia</h3>
          <div className="space-y-2">
            {heatmapByDay.map((d) => (
              <div key={d.dia} className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-8">{d.dia}</span>
                <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden relative">
                  <div className="h-full rounded-md gradient-primary" style={{ width: `${Math.min(100, d.peakVal * 100)}%`, opacity: 0.5 + d.peakVal * 0.5 }} />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">{d.peakHora}h</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Ranking de Links</h3>
          {result.link_ranking.length > 0 ? (
            <div className="space-y-2">
              {result.link_ranking.map((l, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{l.label}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{l.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{l.clicks_previstos.toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-muted-foreground">{(l.pct * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground">Sem links na campanha</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Unsub" value={`${(kpis.unsub * 100).toFixed(3)}%`} icon={<UserMinus className="w-5 h-5" />} trend={kpis.unsub > 0.003 ? 'down' : 'up'} trendValue={kpis.unsub > 0.003 ? 'Elevado' : 'Normal'} />
        <KpiCard label="Spam" value={`${(kpis.spam * 100).toFixed(4)}%`} icon={<ShieldAlert className="w-5 h-5" />} />
        <KpiCard label="Deliverability" value={`${result.deliverability_score.toFixed(0)}/100`} trend={result.deliverability_score > 80 ? 'up' : 'down'} trendValue={result.deliverability_score > 80 ? 'Saudável' : 'Atenção'} />
        <KpiCard label="Reputação" value={`${result.reputacao.toFixed(0)}/100`} trend={result.reputacao > 80 ? 'up' : 'down'} trendValue={result.reputacao > 80 ? 'Boa' : 'Risco'} />
      </div>

      {result.similares_historicos.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Campanhas Similares (Histórico)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground"><th className="pb-2">Nome</th><th className="pb-2">Data</th><th className="pb-2">Open</th><th className="pb-2">CTR</th><th className="pb-2">Unsub</th></tr></thead>
              <tbody>{result.similares_historicos.map((s, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="py-2 text-card-foreground">{s.nome}</td>
                  <td className="py-2 text-muted-foreground">{s.data}</td>
                  <td className="py-2">{(s.kpis.open_rate * 100).toFixed(1)}%</td>
                  <td className="py-2">{(s.kpis.ctr * 100).toFixed(2)}%</td>
                  <td className="py-2">{(s.kpis.unsub * 100).toFixed(3)}%</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
