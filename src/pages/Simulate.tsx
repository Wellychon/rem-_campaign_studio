import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Play, AlertCircle, CheckCircle2, FlaskConical } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Simulate() {
  const { audiences, campaigns, selectedAudienceId, selectedCampaignId, selectAudience, selectCampaign, startSimulation, completeSimulation, jobs } = useApp();
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canRun = selectedAudienceId && selectedCampaignId;
  const selAud = audiences.find((a) => a.id === selectedAudienceId);
  const selCamp = campaigns.find((c) => c.id === selectedCampaignId);

  const handleRun = () => {
    if (!selectedAudienceId || !selectedCampaignId) {
      toast({ title: 'Selecione público e campanha', description: 'É necessário selecionar ambos para rodar a simulação.', variant: 'destructive' });
      return;
    }
    setRunning(true);
    setProgress(0);
    const jobId = startSimulation(selectedAudienceId, selectedCampaignId);
    setCurrentJobId(jobId);

    const duration = 6000 + Math.random() * 4000;
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      const p = Math.min(100, Math.round((step / steps) * 100));
      setProgress(p);
      if (step >= steps) {
        clearInterval(intervalRef.current!);
        completeSimulation(jobId);
        setRunning(false);
        toast({ title: 'Simulação concluída!', description: 'Redirecionando para resultados...' });
        setTimeout(() => navigate('/resultados'), 800);
      }
    }, stepTime);
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Simular com Gêmeos Digitais</h1>
        <p className="text-sm text-muted-foreground">Selecione público e campanha, e rode o teste</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Público</label>
            <Select value={selectedAudienceId || ''} onValueChange={selectAudience}>
              <SelectTrigger><SelectValue placeholder="Selecionar público" /></SelectTrigger>
              <SelectContent>{audiences.map((a) => <SelectItem key={a.id} value={a.id}>{a.nome} ({a.tamanho_amostra.toLocaleString('pt-BR')})</SelectItem>)}</SelectContent>
            </Select>
            {selAud && <p className="text-xs text-muted-foreground mt-1">{selAud.descricao}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Campanha</label>
            <Select value={selectedCampaignId || ''} onValueChange={selectCampaign}>
              <SelectTrigger><SelectValue placeholder="Selecionar campanha" /></SelectTrigger>
              <SelectContent>{campaigns.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
            </Select>
            {selCamp && <p className="text-xs text-muted-foreground mt-1">Subject: {selCamp.subject}</p>}
          </div>
        </div>

        {!canRun && (
          <div className="flex items-center gap-2 text-warning bg-warning/10 px-3 py-2 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Selecione um público e uma campanha para continuar.
          </div>
        )}

        {running ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <FlaskConical className="w-4 h-4 animate-pulse-slow" />
              Simulando com gêmeos digitais...
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">{progress}% — Processando clusters e propensões...</p>
          </div>
        ) : (
          <Button onClick={handleRun} disabled={!canRun} className="w-full gradient-primary border-0 text-primary-foreground" size="lg">
            <Play className="w-4 h-4 mr-2" /> Rodar Teste com Gêmeos Digitais
          </Button>
        )}
      </div>

      {jobs.filter((j) => j.status === 'done').length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Simulações Anteriores</h3>
          <div className="space-y-2">
            {jobs.filter((j) => j.status === 'done').slice(-5).reverse().map((j) => (
              <div key={j.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-card-foreground">{audiences.find((a) => a.id === j.audience_id)?.nome} × {campaigns.find((c) => c.id === j.campaign_id)?.nome}</span>
                </div>
                <span className="text-xs text-muted-foreground">{j.finished_at ? new Date(j.finished_at).toLocaleDateString('pt-BR') : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
