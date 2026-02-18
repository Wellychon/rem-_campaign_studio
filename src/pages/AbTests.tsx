import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, CircleHelp } from 'lucide-react';
import VariantTree from '@/components/abtests/VariantTree';
import VariantDetailPanel from '@/components/abtests/VariantDetailPanel';
import Badge from '@/components/abtests/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/abtests/Tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { AudienceTwinGroup, Campaign } from '@/types';
import type { VariantNodeData } from '@/components/abtests/types';

const alterationLibrary = [
  {
    label: 'Assunto mais curto',
    openDelta: 2.4,
    ctrDelta: 0.25,
    reason: (audience: string) => `Assunto mais curto aumentou abertura em ${audience}.`,
  },
  {
    label: 'Remover emoji do assunto',
    openDelta: 1.6,
    ctrDelta: 0.1,
    reason: (audience: string) => `Emoji removido reduziu fricção para ${audience}.`,
  },
  {
    label: 'CTA mais direto',
    openDelta: 0.4,
    ctrDelta: 0.45,
    reason: (audience: string) => `CTA direto elevou cliques do público ${audience}.`,
  },
  {
    label: 'Personalização no primeiro parágrafo',
    openDelta: 1.1,
    ctrDelta: 0.35,
    reason: (audience: string) => `Personalização inicial aumentou relevância para ${audience}.`,
  },
  {
    label: 'Versão mobile-first',
    openDelta: 0.8,
    ctrDelta: 0.55,
    reason: (audience: string) => `Versão mobile-first melhorou leitura e clique em ${audience}.`,
  },
] as const;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function calcScore(openRate: number, ctr: number) {
  return openRate * 0.65 + ctr * 3.5;
}

function hashToUnit(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return (Math.abs(h) % 1000) / 1000;
}

function getBaseMetrics(audience: AudienceTwinGroup, campaign: Campaign) {
  const engagementBase = 14 + audience.saude.engajamento_medio * 24;
  const objectiveBoost = campaign.objetivo === 'venda' ? 1.2 : campaign.objetivo === 'conteudo' ? 0.6 : 0.8;
  const openRate = clamp(engagementBase + objectiveBoost, 10, 45);
  const ctr = clamp(openRate * 0.17 + objectiveBoost * 0.45, 1.5, 12);
  return { openRate, ctr };
}

function pickTwoAlterations(seed: number) {
  const first = alterationLibrary[seed % alterationLibrary.length];
  const second = alterationLibrary[(seed + 2) % alterationLibrary.length];
  return [first, second];
}

function buildRootVariant(campaign: Campaign, audience: AudienceTwinGroup): VariantNodeData {
  const baseMetrics = getBaseMetrics(audience, campaign);
  const score = calcScore(baseMetrics.openRate, baseMetrics.ctr);

  return {
    id: 'root',
    name: 'Original',
    generation: 0,
    parentId: null,
    status: 'root',
    metrics: {
      openRate: Number(baseMetrics.openRate.toFixed(2)),
      ctr: Number(baseMetrics.ctr.toFixed(2)),
      score: Number(score.toFixed(2)),
      confidence: 88,
    },
    alterations: ['Campanha base sem alterações'],
    reason: 'Ponto de partida para evolução de variantes.',
    timestamp: new Date().toLocaleString('pt-BR'),
    audienceName: audience.nome,
  };
}

function buildChildren(base: VariantNodeData, generation: number, audience: AudienceTwinGroup): [VariantNodeData, VariantNodeData] {
  const [altA, altB] = pickTwoAlterations(generation + base.name.length);
  const now = new Date().toLocaleString('pt-BR');
  const audienceName = audience.nome;

  const jitterA = (Math.random() - 0.5) * 1.2;
  const jitterB = (Math.random() - 0.5) * 1.2;

  const openA = clamp(base.metrics.openRate + altA.openDelta + jitterA, 8, 52);
  const ctrA = clamp(base.metrics.ctr + altA.ctrDelta + jitterA * 0.2, 1, 14);
  const scoreA = calcScore(openA, ctrA);

  const openB = clamp(base.metrics.openRate + altB.openDelta + jitterB, 8, 52);
  const ctrB = clamp(base.metrics.ctr + altB.ctrDelta + jitterB * 0.2, 1, 14);
  const scoreB = calcScore(openB, ctrB);

  const confidenceBase = 74 + generation * 3;

  const variantA: VariantNodeData = {
    id: `${base.id}-${generation}-A`,
    name: `V${generation}-A`,
    generation,
    parentId: base.id,
    status: 'candidate',
    metrics: {
      openRate: Number(openA.toFixed(2)),
      ctr: Number(ctrA.toFixed(2)),
      score: Number(scoreA.toFixed(2)),
      confidence: clamp(Math.round(confidenceBase + Math.random() * 16), 65, 97),
    },
    alterations: [altA.label],
    reason: altA.reason(audienceName),
    timestamp: now,
    audienceName,
  };

  const variantB: VariantNodeData = {
    id: `${base.id}-${generation}-B`,
    name: `V${generation}-B`,
    generation,
    parentId: base.id,
    status: 'candidate',
    metrics: {
      openRate: Number(openB.toFixed(2)),
      ctr: Number(ctrB.toFixed(2)),
      score: Number(scoreB.toFixed(2)),
      confidence: clamp(Math.round(confidenceBase + Math.random() * 16), 65, 97),
    },
    alterations: [altB.label],
    reason: altB.reason(audienceName),
    timestamp: now,
    audienceName,
  };

  return [variantA, variantB];
}

export default function AbTests() {
  const { campaigns, audiences, selectedCampaignId, selectedAudienceId, selectCampaign, selectAudience } = useApp();
  const campaign = campaigns.find((c) => c.id === selectedCampaignId);
  const audience = audiences.find((a) => a.id === selectedAudienceId);

  const [nodes, setNodes] = useState<VariantNodeData[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [winnerNodeId, setWinnerNodeId] = useState<string | null>(null);
  const [roundsToGenerate, setRoundsToGenerate] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [freshNodeIds, setFreshNodeIds] = useState<string[]>([]);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [animatingGeneration, setAnimatingGeneration] = useState<number | null>(null);
  const [generationMessage, setGenerationMessage] = useState<string>('');
  const [compareCampaignAId, setCompareCampaignAId] = useState<string | null>(null);
  const [compareCampaignBId, setCompareCampaignBId] = useState<string | null>(null);
  const [compareSeed, setCompareSeed] = useState(0);
  const nodesRef = useRef<VariantNodeData[]>([]);
  const winnerRef = useRef<string | null>(null);

  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const resetTree = () => {
    if (!campaign || !audience) {
      setNodes([]);
      setSelectedNodeId(null);
      setWinnerNodeId(null);
      nodesRef.current = [];
      winnerRef.current = null;
      return;
    }

    const root = buildRootVariant(campaign, audience);
    setNodes([root]);
    setSelectedNodeId(root.id);
    setWinnerNodeId(root.id);
    nodesRef.current = [root];
    winnerRef.current = root.id;
    setFreshNodeIds([]);
    setHighlightedNodeId(null);
    setAnimatingGeneration(null);
    setGenerationMessage('');
  };

  useEffect(() => {
    resetTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampaignId, selectedAudienceId]);

  useEffect(() => {
    if (!compareCampaignAId && campaigns[0]) setCompareCampaignAId(campaigns[0].id);
    if (!compareCampaignBId && campaigns[1]) setCompareCampaignBId(campaigns[1].id);
  }, [campaigns, compareCampaignAId, compareCampaignBId]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    winnerRef.current = winnerNodeId;
  }, [winnerNodeId]);

  useEffect(() => {
    if (!selectedNodeId) return;
    const target = document.querySelector(`[data-variant-id="${selectedNodeId}"]`);
    if (target && isGenerating) {
      const element = target as HTMLElement;
      const rect = element.getBoundingClientRect();
      const desiredBottomOffset = 120; // keep latest node near the bottom of the viewport
      const top =
        window.scrollY +
        rect.top -
        (window.innerHeight - rect.height - desiredBottomOffset);

      window.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [selectedNodeId, isGenerating, prefersReducedMotion]);

  const runSingleRound = async () => {
    if (!campaign || !audience || nodesRef.current.length === 0) return null;

    const currentNodes = [...nodesRef.current];
    const base = currentNodes.find((n) => n.id === winnerRef.current) || currentNodes[currentNodes.length - 1];
    const generation = base.generation + 1;
    setGenerationMessage(`Gerando a próxima versão (rodada ${generation})...`);

    setAnimatingGeneration(generation);
    if (!prefersReducedMotion) await wait(420);

    const [variantA, variantB] = buildChildren(base, generation, audience);
    const roundIds = [variantA.id, variantB.id];

    const withCandidates = [...currentNodes, variantA, variantB];
    setNodes(withCandidates);
    nodesRef.current = withCandidates;
    setFreshNodeIds(roundIds);

    if (!prefersReducedMotion) await wait(360);

    const winner = variantA.metrics.score >= variantB.metrics.score ? variantA : variantB;
    const loser = winner.id === variantA.id ? variantB : variantA;

    const winnerNode: VariantNodeData = {
      ...winner,
      status: 'approved',
      reason: `${winner.reason} Score superior na rodada ${generation}.`,
    };

    const loserNode: VariantNodeData = {
      ...loser,
      status: 'rejected',
      reason: `${loser.reason} Impacto inferior frente à alternativa vencedora.`,
    };

    const resolvedNodes = withCandidates.map((node) => {
      if (node.id === winnerNode.id) return winnerNode;
      if (node.id === loserNode.id) return loserNode;
      return node;
    });

    setNodes(resolvedNodes);
    nodesRef.current = resolvedNodes;

    setWinnerNodeId(winnerNode.id);
    winnerRef.current = winnerNode.id;
    setSelectedNodeId(winnerNode.id);
    setHighlightedNodeId(winnerNode.id);
    setGenerationMessage(`Variante ${winnerNode.name} venceu e vai para a próxima rodada.`);

    if (!prefersReducedMotion) {
      await wait(280);
      setFreshNodeIds([]);
      setAnimatingGeneration(null);
      await wait(260);
      setHighlightedNodeId(null);
      setGenerationMessage('');
    } else {
      setFreshNodeIds([]);
      setAnimatingGeneration(null);
      setHighlightedNodeId(null);
      setGenerationMessage('');
    }

    return winnerNode.id;
  };

  const handleGenerateEvolution = async () => {
    if (!campaign || !audience || nodes.length === 0 || isGenerating) return;

    setIsGenerating(true);

    const totalRounds = clamp(roundsToGenerate, 1, 6);

    for (let round = 0; round < totalRounds; round++) {
      await runSingleRound();

      if (round < totalRounds - 1 && !prefersReducedMotion) {
        await wait(700);
      }
    }

    setIsGenerating(false);
  };

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId],
  );

  const winnerNode = useMemo(
    () => nodes.find((n) => n.id === winnerNodeId) || null,
    [nodes, winnerNodeId],
  );

  const approved = nodes.filter((n) => n.status === 'approved' || n.status === 'root');
  const rejected = nodes.filter((n) => n.status === 'rejected');
  const insights = nodes.filter((n) => n.status !== 'root');

  const campaignNotes = useMemo(() => {
    return campaigns.map((c) => {
      const base = hashToUnit(c.id + c.nome);
      const nota = 7 + base * 2.8;
      const risco = 100 - nota * 9;
      return {
        id: c.id,
        nome: c.nome,
        nota: Number(nota.toFixed(1)),
        risco: Number(Math.max(8, risco).toFixed(0)),
      };
    });
  }, [campaigns]);

  const compareA = campaigns.find((c) => c.id === compareCampaignAId);
  const compareB = campaigns.find((c) => c.id === compareCampaignBId);

  const compareMetrics = useMemo(() => {
    if (!audience || !compareA || !compareB) return null;
    const jitterA = (hashToUnit(compareA.id + compareSeed) - 0.5) * 1.8;
    const jitterB = (hashToUnit(compareB.id + compareSeed + 1) - 0.5) * 1.8;
    const mA = getBaseMetrics(audience, compareA);
    const mB = getBaseMetrics(audience, compareB);
    const openA = clamp(mA.openRate + jitterA, 8, 52);
    const ctrA = clamp(mA.ctr + jitterA * 0.25, 1, 14);
    const openB = clamp(mB.openRate + jitterB, 8, 52);
    const ctrB = clamp(mB.ctr + jitterB * 0.25, 1, 14);
    return {
      a: { open: openA, ctr: ctrA, score: calcScore(openA, ctrA) },
      b: { open: openB, ctr: ctrB, score: calcScore(openB, ctrB) },
    };
  }, [audience, compareA, compareB, compareSeed]);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-textPrimary">Testes A/B</h1>
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-textSecondary hover:text-brand transition-colors duration-200" aria-label="Explicação da árvore evolutiva">
              <CircleHelp className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[340px]">
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Como funciona a árvore A/B</h3>
            <ul className="space-y-1.5 text-xs text-textSecondary">
              <li>1. Cada rodada cria 2 variantes filhas da vencedora atual.</li>
              <li>2. O motor calcula Open, CTR, Score e Confiança (mockados).</li>
              <li>3. A melhor variante é aprovada e segue para próxima rodada.</li>
              <li>4. A outra variante é negada e fica como galho encerrado.</li>
            </ul>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <p className="text-sm text-textSecondary mt-1">Gerar e evoluir variações dentro da mesma campanha</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Campanha</label>
            <Select value={selectedCampaignId || ''} onValueChange={selectCampaign}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar campanha" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Público</label>
            <Select value={selectedAudienceId || ''} onValueChange={selectAudience}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar público" />
              </SelectTrigger>
              <SelectContent>
                {audiences.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-card-foreground mb-1.5 block">Número de Rodadas</label>
            <Input
              type="number"
              min={1}
              max={6}
              value={roundsToGenerate}
              onChange={(e) => setRoundsToGenerate(clamp(Number(e.target.value || 1), 1, 6))}
            />
          </div>

          <Button
            onClick={handleGenerateEvolution}
            disabled={!campaign || !audience || nodes.length === 0 || isGenerating}
            className={`bg-brand hover:bg-brand-700 text-white ${isGenerating ? 'animate-soft-pulse' : ''}`}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
            {isGenerating ? 'Evoluindo...' : 'Gerar Evolução'}
          </Button>

          <Button variant="outline" onClick={resetTree} disabled={isGenerating}>
            Reiniciar árvore
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-1">
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-card transition-all duration-200">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold text-card-foreground">Árvore de Variações</h2>
              <div className="flex items-center gap-2">
                {isGenerating ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-brand">
                    <Sparkles className="w-3.5 h-3.5 animate-ai-work" />
                    {generationMessage || 'Gerando a próxima versão...'}
                  </span>
                ) : null}
                {winnerNode ? <Badge tone="approved" className="font-semibold">Vencedora atual: {winnerNode.name}</Badge> : null}
              </div>
            </div>
            {nodes.length > 0 ? (
              <VariantTree
                nodes={nodes}
                selectedId={selectedNodeId}
                onSelect={setSelectedNodeId}
                freshNodeIds={freshNodeIds}
                highlightedNodeId={highlightedNodeId}
                animatingGeneration={animatingGeneration}
                isGenerating={isGenerating}
              />
            ) : (
              <p className="text-sm text-textSecondary">Selecione campanha e público para iniciar.</p>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-card transition-all duration-200">
            <Tabs defaultValue="approved">
              <TabsList>
                <TabsTrigger value="approved">Aprovadas</TabsTrigger>
                <TabsTrigger value="rejected">Negadas</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="approved">
                <div className="space-y-3">
                  {approved.length === 0 ? <p className="text-sm text-textSecondary">Nenhuma variação aprovada ainda.</p> : approved.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-card-foreground">{item.name}</p>
                          <Badge tone="approved">Aprovada</Badge>
                        </div>
                        <p className="text-xs text-textSecondary">{item.timestamp}</p>
                      </div>
                      <p className="text-xs text-textSecondary mt-1">Open {item.metrics.openRate.toFixed(1)}% • CTR {item.metrics.ctr.toFixed(2)}% • Score {item.metrics.score.toFixed(1)}</p>
                      <p className="text-sm text-card-foreground mt-2">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rejected">
                <div className="space-y-3">
                  {rejected.length === 0 ? <p className="text-sm text-textSecondary">Nenhuma variação negada ainda.</p> : rejected.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-card-foreground">{item.name}</p>
                          <Badge tone="rejected">Negada</Badge>
                        </div>
                        <p className="text-xs text-textSecondary">{item.timestamp}</p>
                      </div>
                      <p className="text-xs text-textSecondary mt-1">Open {item.metrics.openRate.toFixed(1)}% • CTR {item.metrics.ctr.toFixed(2)}% • Score {item.metrics.score.toFixed(1)}</p>
                      <p className="text-sm text-card-foreground mt-2">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="insights">
                <div className="space-y-3">
                  {insights.length === 0 ? <p className="text-sm text-textSecondary">Gere variações para visualizar insights.</p> : insights.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-card-foreground">{item.name}</p>
                        <p className="text-xs text-textSecondary">{item.timestamp}</p>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-card-foreground">
                        <li>• Alteração: {item.alterations.join(', ')}</li>
                        <li>• Motivo: {item.reason}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="xl:col-span-4">
          <VariantDetailPanel node={selectedNode} winner={winnerNode} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-card-foreground">Notas Mockadas das Campanhas</h2>
            <Badge tone="confidence">Autoavaliação</Badge>
          </div>
          <div className="space-y-2">
            {campaignNotes.slice(0, 5).map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border border-border/70 px-3 py-2.5">
                <p className="text-sm text-card-foreground truncate">{item.nome}</p>
                <p className="text-sm font-semibold text-card-foreground">Nota {item.nota}</p>
                <p className="text-xs text-textSecondary">Risco {item.risco}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-card-foreground">Comparar Campanhas Novamente</h2>
            <Button variant="outline" size="sm" onClick={() => setCompareSeed((s) => s + 1)}>
              Comparar novamente
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select value={compareCampaignAId || ''} onValueChange={setCompareCampaignAId}>
              <SelectTrigger>
                <SelectValue placeholder="Campanha A" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={compareCampaignBId || ''} onValueChange={setCompareCampaignBId}>
              <SelectTrigger>
                <SelectValue placeholder="Campanha B" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {compareMetrics ? (
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-secondary/60 p-3">
                <p className="text-xs text-textSecondary">Campanha A</p>
                <p className="font-medium text-card-foreground mt-1">{compareA?.nome}</p>
                <p className="text-xs text-textSecondary mt-2">Open {compareMetrics.a.open.toFixed(1)}% • CTR {compareMetrics.a.ctr.toFixed(2)}%</p>
                <p className="text-sm font-semibold text-card-foreground mt-1">Score {compareMetrics.a.score.toFixed(1)}</p>
              </div>
              <div className="rounded-lg bg-secondary/60 p-3">
                <p className="text-xs text-textSecondary">Campanha B</p>
                <p className="font-medium text-card-foreground mt-1">{compareB?.nome}</p>
                <p className="text-xs text-textSecondary mt-2">Open {compareMetrics.b.open.toFixed(1)}% • CTR {compareMetrics.b.ctr.toFixed(2)}%</p>
                <p className="text-sm font-semibold text-card-foreground mt-1">Score {compareMetrics.b.score.toFixed(1)}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
