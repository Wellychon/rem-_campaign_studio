import { useApp } from '@/context/AppContext';
import KpiCard from '@/components/shared/KpiCard';
import { ShieldCheck, Percent, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

export default function ModelPerformance() {
  const { audiences, campaigns, results } = useApp();

  const baseOpen = results[0]?.kpis.open_rate || 0.18;
  const baseAud = audiences[0];
  const baseCamp = campaigns[0];

  const validations = Array.from({ length: 10 }, (_, i) => {
    const trendFactor = 0.92 + i * 0.008;
    const noise = Math.sin(i * 1.15) * 0.01;
    const realOpen = baseOpen * (trendFactor + noise);
    const prevOpen = realOpen * (0.985 + Math.cos(i * 0.9) * 0.01);
    const errOpen = Math.abs(prevOpen - realOpen) / Math.max(realOpen, 0.0001);
    return {
      campanha: `${(baseCamp?.nome || 'Novacampteste').split(' ')[0]} #${i + 1}`,
      data: new Date(Date.now() - i * 86400000).toLocaleDateString('pt-BR'),
      publico_sim: baseAud?.nome || 'Público',
      publico_real: baseAud?.nome || 'Público',
      open_prev: prevOpen,
      open_real: realOpen,
      erro_pct: errOpen * 100,
      status: errOpen < 0.05 ? 'OK' : 'Alerta',
    };
  }).reverse();

  const acuracia = 1 - validations.reduce((s, v) => s + v.erro_pct / 100, 0) / validations.length;
  const erroMedio = validations.reduce((s, v) => s + v.erro_pct, 0) / validations.length;
  const estabilidade = (validations.filter((v) => v.erro_pct <= 5).length / validations.length) * 100;
  const forecastSeries = validations.map((v) => ({
    data: v.data,
    previsto: Number((v.open_prev * 100).toFixed(2)),
    real: Number((v.open_real * 100).toFixed(2)),
  }));
  const errorSeries = validations.map((v) => ({ data: v.data, erro_pct: Number(v.erro_pct.toFixed(2)) }));

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-textPrimary">Performance do Modelo</h1>
        <p className="text-sm text-textSecondary mt-1">Painel técnico de saúde do motor preditivo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Acurácia Média" value={`${(acuracia * 100).toFixed(1)}%`} icon={<ShieldCheck className="w-5 h-5" />} />
        <KpiCard label="Erro Médio" value={`${erroMedio.toFixed(2)}%`} icon={<Percent className="w-5 h-5" />} />
        <KpiCard label="Estabilidade (10 testes)" value={`${estabilidade.toFixed(0)}%`} icon={<Activity className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl border border-border p-8 shadow-card">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Previsto vs Real</h2>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={forecastSeries}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="data" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
              <Line type="monotone" dataKey="previsto" name="Previsto" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3, fill: '#2563EB' }} />
              <Line type="monotone" dataKey="real" name="Real" stroke="#60A5FA" strokeWidth={2.5} strokeOpacity={0.9} dot={{ r: 3, fill: '#60A5FA' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-8 shadow-card">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Histórico de Erro</h2>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={errorSeries}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="data" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
              <Line type="monotone" dataKey="erro_pct" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3, fill: '#2563EB' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <details className="bg-card rounded-xl border border-border p-6 shadow-card">
        <summary className="cursor-pointer list-none text-sm font-semibold text-card-foreground">
          Ver detalhes técnicos
        </summary>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground/90">
                <th className="pb-3 font-semibold">Campanha</th>
                <th className="pb-3 font-semibold">Open Prev. vs Real</th>
                <th className="pb-3 font-semibold">Erro %</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-medium text-muted-foreground/70">Data</th>
                <th className="pb-3 font-medium text-muted-foreground/70">Público simulado</th>
                <th className="pb-3 font-medium text-muted-foreground/70">Público real</th>
              </tr>
            </thead>
            <tbody>
              {validations.map((v, i) => (
                <tr key={i} className={`border-t border-border/50 ${i % 2 === 1 ? 'bg-[#FAFAFA]' : ''}`}>
                  <td className="py-3.5 pr-3 font-medium text-card-foreground">{v.campanha}</td>
                  <td className="py-3.5 pr-3 text-card-foreground">
                    <span className="font-medium">{(v.open_prev * 100).toFixed(1)}%</span>
                    <span className="text-textSecondary"> → </span>
                    <span className="font-medium">{(v.open_real * 100).toFixed(1)}%</span>
                  </td>
                  <td className="py-3.5 pr-3 font-semibold text-card-foreground">{v.erro_pct.toFixed(2)}%</td>
                  <td className="py-3.5 pr-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        v.status === 'OK' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 text-textSecondary">{v.data}</td>
                  <td className="py-3.5 pr-3 text-textSecondary">{v.publico_sim}</td>
                  <td className="py-3.5 text-textSecondary">{v.publico_real}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" className="h-9 px-4 text-xs">Recalibrar modelo</Button>
          </div>
        </div>
      </details>
    </div>
  );
}
