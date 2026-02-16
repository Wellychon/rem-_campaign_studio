export interface ClusterDistribution {
  cluster_id: string;
  nome: string;
  percentual: number;
}

export interface AudienceSaude {
  opt_in_pct: number;
  bounce_historico_pct: number;
  engajamento_medio: number;
}

export interface AudienceTwinGroup {
  id: string;
  nome: string;
  origem: 'segmento' | 'cluster' | 'lista_salva';
  tamanho_amostra: number;
  distribuicao_clusters: ClusterDistribution[];
  saude: AudienceSaude;
  filtros: string;
  descricao: string;
}

export interface CampaignLink {
  label: string;
  url: string;
}

export interface Campaign {
  id: string;
  nome: string;
  modo: 'editor_simples' | 'template' | 'import_sf';
  subject: string;
  preheader: string;
  body_html: string;
  body_text: string;
  cta_principal: string;
  links: CampaignLink[];
  remetente_from_name: string;
  remetente_from_email: string;
  objetivo: 'awareness' | 'venda' | 'conteudo';
  data_hora_planejada: string;
  frequencia: string;
  tags: string[];
}

export interface SimulationJob {
  id: string;
  audience_id: string;
  campaign_id: string;
  status: 'queued' | 'running' | 'done';
  progress: number;
  started_at: string;
  finished_at?: string;
}

export interface KPIs {
  open_rate: number;
  ctr: number;
  ctor: number;
  unique_clicks: number;
  unsub: number;
  spam: number;
  bounces_soft: number;
  bounces_hard: number;
  roi?: number;
  conversion?: number;
}

export interface HourDistribution {
  hora: number;
  open_rate: number;
  ctr: number;
}

export interface ClusterResult {
  cluster_id: string;
  nome: string;
  open_rate: number;
  ctr: number;
  unsub: number;
}

export interface LinkRanking {
  label: string;
  url: string;
  clicks_previstos: number;
  pct: number;
}

export interface DeviceSplit {
  device: string;
  pct: number;
}

export interface HeatmapCell {
  dia: number;
  hora: number;
  valor: number;
}

export interface SimulationResult {
  id: string;
  job_id: string;
  audience_id: string;
  campaign_id: string;
  kpis: KPIs;
  hist_open_propensity: number[];
  por_cluster: ClusterResult[];
  por_horario: HourDistribution[];
  heatmap_open_time: HeatmapCell[];
  device_split: DeviceSplit[];
  link_ranking: LinkRanking[];
  deliverability_score: number;
  reputacao: number;
  recomendacoes: string[];
  similares_historicos: { nome: string; data: string; kpis: KPIs }[];
  created_at: string;
}

export interface Insight {
  id: string;
  result_id: string;
  categoria: 'conteudo' | 'publico' | 'timing' | 'abtest';
  severidade: 'alta' | 'media' | 'baixa';
  texto: string;
  evidencia: string;
}
