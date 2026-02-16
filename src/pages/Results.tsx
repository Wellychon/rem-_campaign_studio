import { useApp } from '@/context/AppContext';
import { useParams } from 'react-router-dom';
import KpiCard from '@/components/shared/KpiCard';
import EmptyState from '@/components/shared/EmptyState';
import { BarChart3, Eye, MousePointerClick, UserMinus, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { useState } from 'react';

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

  const [view, setView] = useState<'previsao' | 'historico' | 'comparacao'>('previsao');
  const histData = result.hist_open_propensity.map((v, i) => ({ faixa: `${i * 10}-${(i + 1) * 10}%`, valor: +(v * 100).toFixed(1) }));
  const clusterData = result.por_cluster.map((c) => ({ nome: c.nome, 'Open Rate': +(c.open_rate * 100).toFixed(1), CTR: +(c.ctr * 100).toFixed(2) }));
  const horarioData = result.por_horario.map((h) => ({ hora: `${h.hora}h`, open: +(h.open_rate * 100).toFixed(1), ctr: +(h.ctr * 100).toFixed(2) }));
  const deviceData = result.device_split.map((d) => ({ name: d.device, value: +(d.pct * 100).toFixed(1) }));
  const historicoOverlay = result.por_horario.map((h) => ({ hora: `${h.hora}h`, open: +((h.open_rate * 0.9) * 100).toFixed(1), ctr: +((h.ctr * 0.92) * 100).toFixed(2) }));
  const comparacaoOverlay = result.por_horario.map((h) => ({ hora: `${h.hora}h`, open: +((h.open_rate * 1.05) * 100).toFixed(1), ctr: +((h.ctr * 1.03) * 100).toFixed(2) }));

  const [costPerSend, setCostPerSend] = useState<number>(0.02);
  const [avgConversionValue, setAvgConversionValue] = useState<number>(75);
  const estimatedOpens = Math.round((aud?.tamanho_amostra || 0) * result.kpis.open_rate);
  const estimatedConversions = Math.round(result.kpis.unique_clicks * 0.03); // mock taxa de conversão
  const roi = Math.round(estimatedConversions * avgConversionValue - (aud?.tamanho_amostra || 0) * costPerSend);

  // Heatmap: aggregate by day
  const heatmapByDay = DIAS.map((dia, d) => {
    const cells = result.heatmap_open_time.filter((c) => c.dia === d);
    const peak = cells.reduce((b, c) => (c.valor > b.valor ? c : b), cells[0]);
    return { dia, peakHora: peak?.hora || 0, peakVal: peak?.valor || 0 };
  });

  // Validação do modelo (mock)
  const validations = Array.from({ length: 10 }, (_, i) => {
    const realOpen = result.kpis.open_rate * (0.9 + (i % 3) * 0.03);
    const realCtr = result.kpis.ctr * (0.88 + (i % 4) * 0.02);
    const prevOpen = result.kpis.open_rate * (0.95 + (i % 2) * 0.04);
    const prevCtr = result.kpis.ctr * (0.92 + (i % 3) * 0.03);
    const errOpen = Math.abs(prevOpen - realOpen) / Math.max(realOpen, 0.0001);
    const errCtr = Math.abs(prevCtr - realCtr) / Math.max(realCtr, 0.0001);
    return {
      campanha: `${camp?.nome?.slice(0, 18) || 'Campanha'} #${i + 1}`,
      data: new Date(Date.now() - i * 86400000).toLocaleDateString('pt-BR'),
      publico_sim: aud?.nome || 'Público',
      publico_real: aud?.nome || 'Público',
      open_prev: prevOpen,
      open_real: realOpen,
      ctr_prev: prevCtr,
      ctr_real: realCtr,
      erro_pct: ((errOpen + errCtr) / 2) * 100,
      status: (errOpen + errCtr) / 2 < 0.05 ? 'ok' : 'alerta',
    };
  });
  const acuracia = 1 - validations.reduce((s, v) => s + v.erro_pct / 100, 0) / validations.length;

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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Aberturas Previstas" value={estimatedOpens.toLocaleString('pt-BR')} />
        <KpiCard label="Conversões Previstas" value={estimatedConversions.toLocaleString('pt-BR')} />
        <KpiCard label="ROI Estimado" value={`R$ ${roi.toLocaleString('pt-BR')}`} trend={roi > 0 ? 'up' : 'down'} />
        <div className="bg-card rounded-xl border border-border p-4 shadow-card">
          <p className="text-xs text-muted-foreground mb-1">Inputs de ROI</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-muted-foreground">Custo por envio/CPM</label>
              <input type="number" className="w-full rounded-md border border-border bg-muted/40 p-2 text-xs" value={costPerSend} onChange={(e) => setCostPerSend(parseFloat(e.target.value || '0'))} />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Valor médio por conversão</label>
              <input type="number" className="w-full rounded-md border border-border bg-muted/40 p-2 text-xs" value={avgConversionValue} onChange={(e) => setAvgConversionValue(parseFloat(e.target.value || '0'))} />
            </div>
          </div>
        </div>
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-card-foreground">Variação por Horário</h3>
            <div className="flex items-center gap-2 text-xs">
              {(['previsao', 'historico', 'comparacao'] as const).map((v) => (
                <button key={v} className={`px-2 py-1 rounded-md border ${view === v ? 'bg-muted' : 'bg-transparent'}`} onClick={() => setView(v)}>
                  {v === 'previsao' ? 'Previsão' : v === 'historico' ? 'Histórico' : 'Comparação'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={horarioData}>
              <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="open" stroke="#3B82F6" strokeWidth={2} name="Open %" dot={false} />
              <Line type="monotone" dataKey="ctr" stroke="#8B5CF6" strokeWidth={2} name="CTR %" dot={false} />
              {view === 'historico' && (
                <>
                  <Line type="monotone" dataKey="open" stroke="#3B82F6" strokeDasharray="4 4" strokeWidth={1.5} name="Open (Histórico)" dot={false} data={historicoOverlay as any} />
                  <Line type="monotone" dataKey="ctr" stroke="#8B5CF6" strokeDasharray="4 4" strokeWidth={1.5} name="CTR (Histórico)" dot={false} data={historicoOverlay as any} />
                </>
              )}
              {view === 'comparacao' && (
                <>
                  <Line type="monotone" dataKey="open" stroke="#3B82F6" strokeDasharray="2 6" strokeWidth={1.5} name="Open (Comparação)" dot={false} data={comparacaoOverlay as any} />
                  <Line type="monotone" dataKey="ctr" stroke="#8B5CF6" strokeDasharray="2 6" strokeWidth={1.5} name="CTR (Comparação)" dot={false} data={comparacaoOverlay as any} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
          {view !== 'previsao' && (
            <p className="text-[11px] text-warning mt-2">Alerta: desvio &gt;10% em alguns horários (mock).</p>
          )}
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-card-foreground">Ranking de Links</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Filtro:</span>
              <select className="border border-border rounded-md bg-muted/40 px-2 py-1"
                onChange={(e) => {
                  const cid = e.target.value;
                  const cl = result.por_cluster.find((c) => c.cluster_id === cid);
                  if (cl) {
                    // simple reweight preview (mock)
                    result.link_ranking = [...result.link_ranking]
                      .map((l) => ({ ...l, clicks_previstos: Math.round(l.clicks_previstos * (0.8 + cl.ctr * 2)) }))
                      .sort((a, b) => b.clicks_previstos - a.clicks_previstos);
                  }
                }}
              >
                <option value="">Todos</option>
                {result.por_cluster.map((c) => <option key={c.cluster_id} value={c.cluster_id}>{c.nome}</option>)}
              </select>
            </div>
          </div>
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

      {/* Validação do Modelo (mock) */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-card-foreground">Validação do Modelo</h3>
          <div className="text-xs px-2 py-1 rounded-md bg-muted/50">Confiança: {(acuracia * 100).toFixed(0)}% | Últimas 10: {validations.filter((v) => v.erro_pct < 5).length} dentro de ±5%</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="pb-2">Campanha</th>
                <th className="pb-2">Data</th>
                <th className="pb-2">Público simulado</th>
                <th className="pb-2">Público real</th>
                <th className="pb-2">Open Prev.</th>
                <th className="pb-2">Open Real</th>
                <th className="pb-2">Erro %</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {validations.map((v, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="py-2 text-card-foreground">{v.campanha}</td>
                  <td className="py-2 text-muted-foreground">{v.data}</td>
                  <td className="py-2">{v.publico_sim}</td>
                  <td className="py-2">{v.publico_real}</td>
                  <td className="py-2">{(v.open_prev * 100).toFixed(1)}%</td>
                  <td className="py-2">{(v.open_real * 100).toFixed(1)}%</td>
                  <td className="py-2">{v.erro_pct.toFixed(2)}%</td>
                  <td className="py-2">{v.status === 'ok' ? 'OK' : 'Alerta'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          <button className="text-xs px-3 py-1 rounded-md border bg-muted hover:bg-muted/70">Recalibrar modelo</button>
          <p className="text-[11px] text-muted-foreground mt-2">Acurácia = 1 − média(|prev − real|/real)</p>
        </div>
      </div>
    </div>
  );
}
