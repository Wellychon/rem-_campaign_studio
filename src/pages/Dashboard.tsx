import { useApp } from '@/context/AppContext';
import KpiCard from '@/components/shared/KpiCard';
import { Users, Mail, BarChart3, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

export default function Dashboard() {
  const { audiences, campaigns, results, jobs } = useApp();

  const avgOpen = results.length > 0 ? results.reduce((s, r) => s + r.kpis.open_rate, 0) / results.length : 0;

  const recentResults = results.slice(-3).reverse();
  const clusterData = audiences[0]?.distribuicao_clusters.map((c) => ({ name: c.nome, value: c.percentual })) || [];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do TwinSim Email Lab</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Públicos" value={audiences.length} subtitle="gêmeos digitais" icon={<Users className="w-5 h-5" />} />
        <KpiCard label="Campanhas" value={campaigns.length} subtitle="configuradas" icon={<Mail className="w-5 h-5" />} />
        <KpiCard label="Simulações" value={jobs.filter((j) => j.status === 'done').length} subtitle="concluídas" icon={<BarChart3 className="w-5 h-5" />} />
        <KpiCard label="Open Rate Médio" value={`${(avgOpen * 100).toFixed(1)}%`} subtitle="das simulações" icon={<Play className="w-5 h-5" />} trend={avgOpen > 0.2 ? 'up' : 'down'} trendValue={avgOpen > 0.2 ? 'Acima da média' : 'Abaixo da média'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-card-foreground">Simulações Recentes</h2>
            <Link to="/resultados"><Button variant="ghost" size="sm" className="text-xs">Ver todos <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
          </div>
          {recentResults.length > 0 ? (
            <div className="space-y-3">
              {recentResults.map((r) => {
                const camp = campaigns.find((c) => c.id === r.campaign_id);
                const aud = audiences.find((a) => a.id === r.audience_id);
                return (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
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

        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h2 className="text-sm font-semibold text-card-foreground mb-4">Distribuição de Clusters — {audiences[0]?.nome}</h2>
          {clusterData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={clusterData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={3} label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/publicos" className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow group">
          <Users className="w-6 h-6 text-primary mb-2" />
          <h3 className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">Gerenciar Públicos</h3>
          <p className="text-xs text-muted-foreground mt-1">Crie e configure gêmeos digitais</p>
        </Link>
        <Link to="/campanhas/nova" className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow group">
          <Mail className="w-6 h-6 text-accent mb-2" />
          <h3 className="text-sm font-semibold text-card-foreground group-hover:text-accent transition-colors">Nova Campanha</h3>
          <p className="text-xs text-muted-foreground mt-1">Crie uma campanha para simular</p>
        </Link>
        <Link to="/simular" className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow group">
          <Play className="w-6 h-6 text-success mb-2" />
          <h3 className="text-sm font-semibold text-card-foreground group-hover:text-success transition-colors">Rodar Simulação</h3>
          <p className="text-xs text-muted-foreground mt-1">Teste com gêmeos digitais</p>
        </Link>
      </div>
    </div>
  );
}
