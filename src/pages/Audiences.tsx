import { useApp } from '@/context/AppContext';
import { Users, Plus, Shield, TrendingUp, AlertTriangle, Database, PlugZap, FileSpreadsheet, ServerCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState } from 'react';
import type { AudienceTwinGroup } from '@/types';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

function HealthBadge({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${warn ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
      {warn ? <AlertTriangle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
      {label}: {value}
    </div>
  );
}

export default function Audiences() {
  const { audiences, addAudience, selectAudience } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', origem: 'segmento' as const, tamanho: [20000], descricao: '', filtros: '' });
  const [dsStatus, setDsStatus] = useState<'conectado' | 'erro' | 'desconectado'>('conectado');
  const [sql, setSql] = useState<string>('SELECT id, email, ltv, last_purchase FROM salesforce.contacts WHERE opt_in = true');
  const [previewCols, setPreviewCols] = useState<string[]>(['id', 'email', 'ltv', 'last_purchase']);
  const [rowCount, setRowCount] = useState<number>(200000);
  const [sample, setSample] = useState<number>(20000);

  const handleCreate = () => {
    const newAud: AudienceTwinGroup = {
      id: `aud-${Date.now()}`,
      nome: form.nome || 'Novo Público',
      origem: form.origem,
      tamanho_amostra: form.tamanho[0],
      distribuicao_clusters: [
        { cluster_id: `c-${Date.now()}-1`, nome: 'Cluster A', percentual: 40 },
        { cluster_id: `c-${Date.now()}-2`, nome: 'Cluster B', percentual: 35 },
        { cluster_id: `c-${Date.now()}-3`, nome: 'Cluster C', percentual: 25 },
      ],
      saude: { opt_in_pct: 85 + Math.random() * 10, bounce_historico_pct: 1 + Math.random() * 4, engajamento_medio: 0.3 + Math.random() * 0.4 },
      filtros: form.filtros || 'Sem filtros específicos',
      descricao: form.descricao || 'Público personalizado',
    };
    addAudience(newAud);
    setOpen(false);
    setForm({ nome: '', origem: 'segmento', tamanho: [20000], descricao: '', filtros: '' });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Públicos (Gêmeos Digitais)</h1>
        </div>
        <Badge variant="outline">frontend-only • dados simulados</Badge>
      </div>
      <p className="text-sm text-muted-foreground">Gerencie e configure seus públicos de simulação</p>
      <div className="flex items-center justify-between">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Criar Público</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Público</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Clientes VIP" /></div>
              <div>
                <Label>Origem</Label>
                <Select value={form.origem} onValueChange={(v: any) => setForm({ ...form, origem: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="segmento">Segmento</SelectItem>
                    <SelectItem value="cluster">Clusters Comportamentais</SelectItem>
                    <SelectItem value="lista_salva">Lista Salva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tamanho da Amostra: {form.tamanho[0].toLocaleString('pt-BR')}</Label>
                <Slider value={form.tamanho} onValueChange={(v) => setForm({ ...form, tamanho: v })} min={5000} max={100000} step={5000} className="mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>5k</span><span>50k</span><span>100k</span></div>
              </div>
              <div><Label>Descrição</Label><Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição do público" /></div>
              <div><Label>Filtros</Label><Input value={form.filtros} onChange={(e) => setForm({ ...form, filtros: e.target.value })} placeholder="Ex: LTV > R$200" /></div>
              <Button onClick={handleCreate} className="w-full">Criar Público</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fonte de Dados & SQL (mock) */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlugZap className="w-4 h-4" />
            <p className="text-sm font-semibold text-card-foreground">Status da Conexão</p>
          </div>
          <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full ${dsStatus === 'conectado' ? 'bg-success/10 text-success' : dsStatus === 'erro' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
            <span>{dsStatus === 'conectado' ? 'Conectado ao Banco de Dados' : dsStatus === 'erro' ? 'Erro de Conexão' : 'Desconectado'}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Label>SQL Customizado</Label>
            <textarea className="w-full h-28 rounded-md border border-border bg-muted/40 p-2 text-sm" value={sql} onChange={(e) => setSql(e.target.value)} />
            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => { setPreviewCols(['id', 'email', 'persona', 'engagement_score', 'device']); setRowCount(120345); toastPreview(); }}>Preview (mock)</Button>
              <Button variant="ghost" size="sm" onClick={() => setDsStatus('conectado')}>Conectar</Button>
              <Button variant="ghost" size="sm" onClick={() => setDsStatus('erro')}>Simular Erro</Button>
              <Button variant="ghost" size="sm" onClick={() => setDsStatus('desconectado')}>Desconectar</Button>
            </div>
          </div>
          <div className="bg-muted/40 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2"><ServerCog className="w-4 h-4" /><p className="text-xs font-medium text-muted-foreground uppercase">Conexões Pré-config</p></div>
            <div className="space-y-1">
              <Button variant="outline" size="sm" className="w-full justify-between"><span>Salesforce</span><span className="text-[10px] text-muted-foreground">mock</span></Button>
              <Button variant="outline" size="sm" className="w-full justify-between"><span>HubSpot</span><span className="text-[10px] text-muted-foreground">mock</span></Button>
              <Button variant="outline" size="sm" className="w-full justify-between"><span>Upload CSV</span><FileSpreadsheet className="w-3 h-3" /></Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Última sincronização</p>
            <p className="text-sm font-medium">{new Date().toLocaleString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Row Count</p>
            <p className="text-sm font-medium">{rowCount.toLocaleString('pt-BR')}</p>
          </div>
          <div>
            <Label>Usar amostra de N registros</Label>
            <Input type="number" value={sample} onChange={(e) => setSample(parseInt(e.target.value || '0'))} />
            {sample < 100 && <p className="text-[10px] text-warning mt-1">Aviso: amostra muito pequena (&lt;100)</p>}
            {sample > 1000000 && <p className="text-[10px] text-destructive mt-1">Aviso: amostra muito grande (&gt;1M)</p>}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Preview de Colunas (mock)</p>
          <div className="flex flex-wrap gap-1">
            {previewCols.map((c) => <span key={c} className="text-[11px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground">{c}</span>)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {audiences.map((aud) => {
          const chartData = aud.distribuicao_clusters.map((c) => ({ name: c.nome, value: c.percentual }));
          return (
            <div key={aud.id} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => selectAudience(aud.id)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">{aud.nome}</h3>
                  <p className="text-xs text-muted-foreground">{aud.descricao}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{aud.origem}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-card-foreground">{aud.tamanho_amostra.toLocaleString('pt-BR')} gêmeos</span>
              </div>

              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={45} innerRadius={25} paddingAngle={2}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex flex-wrap gap-1.5 mt-3">
                <HealthBadge label="Opt-in" value={`${aud.saude.opt_in_pct.toFixed(0)}%`} warn={aud.saude.opt_in_pct < 80} />
                <HealthBadge label="Bounce" value={`${aud.saude.bounce_historico_pct.toFixed(1)}%`} warn={aud.saude.bounce_historico_pct > 5} />
                <HealthBadge label="Engaj." value={`${(aud.saude.engajamento_medio * 100).toFixed(0)}%`} warn={aud.saude.engajamento_medio < 0.3} />
              </div>

              <p className="text-[10px] text-muted-foreground mt-3">{aud.filtros}</p>
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={() => selectAudience(aud.id)}>Simular com este público</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function toastPreview() {
  // Lightweight inline toast substitute for this page only
  try { (window as any).__twinsim_toast?.({ title: 'Preview gerado', description: 'Dados simulados (mock)' }); } catch {}
}
