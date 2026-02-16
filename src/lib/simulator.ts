import type { AudienceTwinGroup, Campaign, SimulationResult, Insight, KPIs } from '@/types';

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function simulate(
  audience: AudienceTwinGroup,
  campaign: Campaign
): { result: SimulationResult; insights: Insight[] } {
  const rng = mulberry32(hashStr(audience.id + campaign.id));
  const insights: Insight[] = [];
  let idc = 0;
  const iid = () => `ins-${audience.id}-${campaign.id}-${idc++}`;

  let baseOpen = 0.22 + rng() * 0.08;
  let baseCtr = 0.04 + rng() * 0.02;

  // Rule: long subject
  if (campaign.subject.length > 60) {
    baseOpen *= 0.85;
    insights.push({ id: iid(), result_id: '', categoria: 'conteudo', severidade: 'alta', texto: 'Assunto muito longo (>60 chars) pode reduzir taxa de abertura em até 15%.', evidencia: `Subject tem ${campaign.subject.length} caracteres` });
  }

  // Rule: emoji in subject
  if (/[\u{1F300}-\u{1FAD6}]/u.test(campaign.subject)) {
    baseOpen *= 0.97;
    insights.push({ id: iid(), result_id: '', categoria: 'conteudo', severidade: 'media', texto: 'Emoji no assunto pode polarizar. Clusters conservadores tendem a ignorar.', evidencia: 'Emoji detectado no subject' });
  }

  // Rule: generic CTA
  const genericCtas = ['clique aqui', 'saiba mais', 'click here', 'ver mais'];
  if (genericCtas.some((g) => campaign.cta_principal.toLowerCase().includes(g))) {
    baseCtr *= 0.8;
    insights.push({ id: iid(), result_id: '', categoria: 'conteudo', severidade: 'alta', texto: 'CTA genérico detectado. CTAs específicos aumentam CTR em até 20%.', evidencia: `CTA atual: "${campaign.cta_principal}"` });
  }

  // Rule: low engagement audience
  if (audience.saude.engajamento_medio < 0.3) {
    baseOpen *= 0.7;
    baseCtr *= 0.7;
    insights.push({ id: iid(), result_id: '', categoria: 'publico', severidade: 'alta', texto: 'Público com engajamento histórico baixo. Considere segmentar ativos recentes.', evidencia: `Engajamento médio: ${(audience.saude.engajamento_medio * 100).toFixed(0)}%` });
  }

  // Rule: high frequency
  if (campaign.frequencia === 'diaria') {
    baseOpen *= 0.75;
    insights.push({ id: iid(), result_id: '', categoria: 'publico', severidade: 'alta', texto: 'Frequência diária aumenta risco de fadiga e descadastro.', evidencia: `Frequência: ${campaign.frequencia}` });
  }

  // Rule: objective
  if (campaign.objetivo === 'venda') {
    baseCtr *= 1.15;
    insights.push({ id: iid(), result_id: '', categoria: 'conteudo', severidade: 'media', texto: 'Objetivo de venda tende a gerar maior CTR mas pode elevar spam complaints.', evidencia: 'Objetivo: venda' });
  }

  const openRate = Math.min(Math.max(baseOpen, 0.05), 0.55);
  const ctr = Math.min(Math.max(baseCtr, 0.01), 0.15);
  const ctor = openRate > 0 ? ctr / openRate : 0;
  const uniqueClicks = Math.round(audience.tamanho_amostra * ctr);
  const unsub = 0.001 + rng() * 0.003;
  const spam = 0.0001 + rng() * 0.001;
  const bouncesSoft = 0.01 + rng() * 0.02;
  const bouncesHard = 0.005 + rng() * 0.01;

  const histOpenPropensity = Array.from({ length: 10 }, (_, i) => {
    const c = openRate * 10;
    const d = Math.abs(i - c);
    return Math.max(0, (1 - d * 0.15) * (0.05 + rng() * 0.15));
  });

  const porCluster = audience.distribuicao_clusters.map((c) => ({
    cluster_id: c.cluster_id,
    nome: c.nome,
    open_rate: openRate * (0.7 + rng() * 0.6),
    ctr: ctr * (0.6 + rng() * 0.8),
    unsub: unsub * (0.5 + rng() * 1.5),
  }));

  const porHorario = Array.from({ length: 24 }, (_, h) => {
    const pm = Math.exp(-((h - 10) ** 2) / 18);
    const pa = Math.exp(-((h - 15) ** 2) / 12) * 0.7;
    const f = pm + pa + 0.1;
    return { hora: h, open_rate: openRate * f * (0.8 + rng() * 0.4), ctr: ctr * f * (0.7 + rng() * 0.6) };
  });

  const heatmap: { dia: number; hora: number; valor: number }[] = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const wf = d < 5 ? 1 : 0.6;
      const hf = Math.exp(-((h - 10) ** 2) / 20) + Math.exp(-((h - 15) ** 2) / 15) * 0.6;
      heatmap.push({ dia: d, hora: h, valor: wf * hf * (0.5 + rng() * 0.5) });
    }
  }

  const mobilePct = 0.5 + rng() * 0.3;
  const deviceSplit = [
    { device: 'Mobile', pct: mobilePct },
    { device: 'Desktop', pct: (1 - mobilePct) * 0.7 },
    { device: 'Tablet', pct: (1 - mobilePct) * 0.3 },
  ];

  if (mobilePct > 0.65) {
    insights.push({ id: iid(), result_id: '', categoria: 'publico', severidade: 'media', texto: 'Público majoritariamente mobile. Garanta CTA acima da dobra e layout responsivo.', evidencia: `Mobile: ${(mobilePct * 100).toFixed(0)}%` });
  }

  const linkRanking = campaign.links.map((l) => ({
    label: l.label,
    url: l.url,
    clicks_previstos: Math.round(uniqueClicks * (0.1 + rng() * 0.4)),
    pct: 0,
  }));
  const totalLC = linkRanking.reduce((s, l) => s + l.clicks_previstos, 0) || 1;
  linkRanking.forEach((l) => (l.pct = l.clicks_previstos / totalLC));
  linkRanking.sort((a, b) => b.clicks_previstos - a.clicks_previstos);

  const bestHour = porHorario.reduce((b, h) => (h.open_rate > b.open_rate ? h : b), porHorario[0]);
  insights.push({ id: iid(), result_id: '', categoria: 'timing', severidade: 'media', texto: `Melhor horário previsto para envio: ${bestHour.hora}h. Terças e quartas tendem a performar melhor.`, evidencia: `Open rate às ${bestHour.hora}h: ${(bestHour.open_rate * 100).toFixed(1)}%` });

  insights.push({ id: iid(), result_id: '', categoria: 'abtest', severidade: 'baixa', texto: 'Sugerimos testar variações de assunto e CTA para otimizar resultados.', evidencia: 'Baseado em análise de clusters divergentes' });

  const deliverabilityScore = Math.min(100, Math.max(50, 100 - (bouncesSoft + bouncesHard) * 500 - spam * 5000 + rng() * 10));
  const reputacao = Math.min(100, Math.max(60, 100 - unsub * 2000 - spam * 10000 + rng() * 5));

  const kpis: KPIs = { open_rate: openRate, ctr, ctor, unique_clicks: uniqueClicks, unsub, spam, bounces_soft: bouncesSoft, bounces_hard: bouncesHard };

  const resultId = `res-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const result: SimulationResult = {
    id: resultId,
    job_id: '',
    audience_id: audience.id,
    campaign_id: campaign.id,
    kpis,
    hist_open_propensity: histOpenPropensity,
    por_cluster: porCluster,
    por_horario: porHorario,
    heatmap_open_time: heatmap,
    device_split: deviceSplit,
    link_ranking: linkRanking,
    deliverability_score: deliverabilityScore,
    reputacao,
    recomendacoes: [
      'Otimize o assunto para menos de 50 caracteres',
      'Considere personalização no preheader',
      'Teste envio em horários diferentes para clusters específicos',
    ],
    similares_historicos: [
      {
        nome: 'Campanha Similar Q3 2024',
        data: '2024-09-15',
        kpis: { open_rate: openRate * (0.9 + rng() * 0.2), ctr: ctr * (0.85 + rng() * 0.3), ctor: ctor * (0.9 + rng() * 0.2), unique_clicks: Math.round(uniqueClicks * 0.8), unsub: unsub * 1.1, spam: spam * 0.9, bounces_soft: bouncesSoft * 1.05, bounces_hard: bouncesHard * 0.95 },
      },
    ],
    created_at: new Date().toISOString(),
  };

  insights.forEach((i) => (i.result_id = resultId));

  return { result, insights };
}

export function generateAbVariants(campaign: Campaign) {
  const subjects = [
    campaign.subject,
    `[Exclusivo] ${campaign.subject.replace(/^[\u{1F300}-\u{1FAD6}]\s*/u, '')}`,
    `Última chance: ${campaign.subject.replace(/^[\u{1F300}-\u{1FAD6}]\s*/u, '').slice(0, 40)}`,
    `Você não vai querer perder: ${campaign.subject.replace(/^[\u{1F300}-\u{1FAD6}]\s*/u, '').slice(0, 30)}`,
  ];
  const ctas = [campaign.cta_principal, 'Quero Aproveitar Agora', 'Ver Detalhes →'];
  return { subjects, ctas };
}
