import { useApp } from '@/context/AppContext';
import KpiCard from '@/components/shared/KpiCard';
import { Users, Mail, BarChart3, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#16A34A', '#D97706', '#DC2626'];

export default function Dashboard() {
  const { audiences, campaigns, results, jobs } = useApp();

  const avgOpen = results.length > 0 ? results.reduce((s, r) => s + r.kpis.open_rate, 0) / results.length : 0;
  const recentResults = results.slice(-3).reverse();
  const clusterData = audiences[0]?.distribuicao_clusters.map((c) => ({ name: c.nome, value: c.percentual })) || [];

  const openHistory = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const base = avgOpen || 0.2;
    const sim = Math.min(0.45, Math.max(0.08, base * (0.92 + (i % 7) * 0.015)));
    const hist = Math.min(0.42, Math.max(0.08, base * (0.9 + ((i + 3) % 5) * 0.012)));
    return { dia: `${date.getDate()}/${date.getMonth() + 1}`, simulado: Number((sim * 100).toFixed(2)), historico: Number((hist * 100).toFixed(2)) };
  });

  const simulationTrend = Array.from({ length: 8 }, (_, i) => {
    const week = `S${i + 1}`;
    const done = jobs.filter((j) => j.status === 'done').length;
    const value = Math.max(1, Math.round(done / 4) + (i % 3) + (i > 4 ? 1 : 0));
    return { semana: week, simulacoes: value };
  });

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Dashboard</h1>
          <p className="text-sm text-textSecondary">Visao geral do Remi Campaign Studio</p>
        </div>
        <Button className="bg-brand hover:bg-brand-700 text-white">Nova Simulacao</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Públicos" value={audiences.length} subtitle="gêmeos digitais" icon={<Users className="w-5 h-5" />} />
        <KpiCard label="Campanhas" value={campaigns.length} subtitle="configuradas" icon={<Mail className="w-5 h-5" />} />
        <KpiCard label="Simulações" value={jobs.filter((j) => j.status === 'done').length} subtitle="concluídas" icon={<BarChart3 className="w-5 h-5" />} />
        <KpiCard label="Open Rate Médio" value={`${(avgOpen * 100).toFixed(1)}%`} subtitle="das simulações" icon={<Play className="w-5 h-5" />} trend={avgOpen > 0.2 ? 'up' : 'down'} trendValue={avgOpen > 0.2 ? 'Acima da média' : 'Abaixo da média'} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl border border-border p-8 shadow-card">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Histórico de Open Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={openHistory}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
              <Line type="monotone" dataKey="simulado" name="Simulado" stroke="#2563EB" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="historico" name="Média histórica" stroke="#60A5FA" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-8 shadow-card">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Distribuição de Clusters</h2>
          {clusterData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={clusterData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} innerRadius={55} paddingAngle={3} label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                  {clusterData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl border border-border p-8 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-card-foreground">Simulações Recentes</h2>
            <Link to="/resultados"><Button variant="ghost" size="sm" className="text-xs">Ver todos <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
          </div>
          {recentResults.length > 0 ? (
            <div className="space-y-3">
              {recentResults.map((r) => {
                const camp = campaigns.find((c) => c.id === r.campaign_id);
                const aud = audiences.find((a) => a.id === r.audience_id);
                return (
                  <div key={r.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{camp?.nome || 'Campanha'}</p>
                      <p className="text-xs text-muted-foreground">{aud?.nome || 'Público'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">{(r.kpis.open_rate * 100).toFixed(1)}% open</p>
                      <p className="text-xs text-muted-foreground">{(r.kpis.ctr * 100).toFixed(2)}% CTR</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma simulação ainda. <Link to="/simular" className="text-primary hover:underline">Rodar primeira simulação →</Link></p>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-8 shadow-card">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Tendência de Simulações</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={simulationTrend}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="semana" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="simulacoes" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
