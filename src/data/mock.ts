import type { AudienceTwinGroup, Campaign, SimulationResult, SimulationJob, Insight } from '@/types';
import { simulate } from '@/lib/simulator';

export const initialAudiences: AudienceTwinGroup[] = [
  {
    id: 'aud-001',
    nome: 'Clientes Premium',
    origem: 'segmento',
    tamanho_amostra: 25000,
    distribuicao_clusters: [
      { cluster_id: 'c1', nome: 'Compradores Frequentes', percentual: 35 },
      { cluster_id: 'c2', nome: 'Alto Ticket', percentual: 25 },
      { cluster_id: 'c3', nome: 'Mobile-First', percentual: 22 },
      { cluster_id: 'c4', nome: 'Engajados Social', percentual: 18 },
    ],
    saude: { opt_in_pct: 94, bounce_historico_pct: 1.2, engajamento_medio: 0.68 },
    filtros: 'LTV > R$500, última compra < 90 dias',
    descricao: 'Clientes de alto valor com compras recentes',
  },
  {
    id: 'aud-002',
    nome: 'Leads Novos Q4',
    origem: 'cluster',
    tamanho_amostra: 50000,
    distribuicao_clusters: [
      { cluster_id: 'c5', nome: 'Cadastro Recente', percentual: 40 },
      { cluster_id: 'c6', nome: 'Orgânico SEO', percentual: 30 },
      { cluster_id: 'c7', nome: 'Paid Social', percentual: 20 },
      { cluster_id: 'c8', nome: 'Indicação', percentual: 10 },
    ],
    saude: { opt_in_pct: 88, bounce_historico_pct: 3.5, engajamento_medio: 0.42 },
    filtros: 'Data cadastro > 2024-10-01',
    descricao: 'Leads captados no último trimestre, sem compra ainda',
  },
  {
    id: 'aud-003',
    nome: 'Reengajamento Inativos',
    origem: 'lista_salva',
    tamanho_amostra: 15000,
    distribuicao_clusters: [
      { cluster_id: 'c9', nome: 'Inativos 90 dias', percentual: 45 },
      { cluster_id: 'c10', nome: 'Inativos 180 dias', percentual: 35 },
      { cluster_id: 'c11', nome: 'Churned', percentual: 20 },
    ],
    saude: { opt_in_pct: 72, bounce_historico_pct: 8.1, engajamento_medio: 0.12 },
    filtros: 'Último engajamento > 90 dias, sem compra > 180 dias',
    descricao: 'Contatos inativos para tentativa de reengajamento',
  },
];

export const initialCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    nome: 'Black Friday 2024 - Oferta Exclusiva',
    modo: 'editor_simples',
    subject: '🔥 Só hoje: até 60% OFF para você!',
    preheader: 'Ofertas exclusivas para clientes especiais',
    body_html: '<h1>Black Friday Especial</h1><p>Aproveite descontos de até 60% em produtos selecionados. Oferta válida apenas hoje!</p>',
    body_text: 'Black Friday Especial - Aproveite descontos de até 60% em produtos selecionados.',
    cta_principal: 'Garantir Minha Oferta',
    links: [
      { label: 'Ver Ofertas', url: 'https://loja.exemplo.com/blackfriday' },
      { label: 'Categorias', url: 'https://loja.exemplo.com/categorias' },
      { label: 'Minha Conta', url: 'https://loja.exemplo.com/conta' },
    ],
    remetente_from_name: 'Loja Exemplo',
    remetente_from_email: 'ofertas@loja.exemplo.com',
    objetivo: 'venda',
    data_hora_planejada: '2024-11-29T09:00:00',
    frequencia: 'unica',
    tags: ['black-friday', 'promocao', 'urgente'],
  },
  {
    id: 'camp-002',
    nome: 'Newsletter Mensal - Janeiro',
    modo: 'template',
    subject: 'As melhores dicas para começar 2025 com o pé direito',
    preheader: 'Tendências, dicas e novidades para você',
    body_html: '<h1>Newsletter Janeiro 2025</h1><p>Confira as principais tendências e novidades do mercado.</p>',
    body_text: 'Newsletter Janeiro 2025 - Confira as principais tendências.',
    cta_principal: 'Ler Matéria Completa',
    links: [
      { label: 'Blog', url: 'https://blog.exemplo.com' },
      { label: 'Podcast', url: 'https://podcast.exemplo.com' },
    ],
    remetente_from_name: 'Equipe de Conteúdo',
    remetente_from_email: 'conteudo@exemplo.com',
    objetivo: 'conteudo',
    data_hora_planejada: '2025-01-15T08:00:00',
    frequencia: 'mensal',
    tags: ['newsletter', 'conteudo'],
  },
  {
    id: 'camp-003',
    nome: 'Webinar: Tendências 2025',
    modo: 'editor_simples',
    subject: 'Convite: Webinar gratuito sobre tendências digitais 2025',
    preheader: 'Reserve sua vaga - vagas limitadas',
    body_html: '<h1>Webinar Exclusivo</h1><p>Participe do nosso webinar sobre as principais tendências digitais para 2025.</p>',
    body_text: 'Webinar Exclusivo - Participe do nosso webinar sobre tendências digitais 2025.',
    cta_principal: 'Inscrever-se Agora',
    links: [
      { label: 'Página do Evento', url: 'https://eventos.exemplo.com/webinar-2025' },
      { label: 'Agenda', url: 'https://eventos.exemplo.com/agenda' },
    ],
    remetente_from_name: 'Eventos Exemplo',
    remetente_from_email: 'eventos@exemplo.com',
    objetivo: 'awareness',
    data_hora_planejada: '2025-02-10T14:00:00',
    frequencia: 'unica',
    tags: ['webinar', 'evento', 'awareness'],
  },
];

// Pre-build one result for demo
const { result: demoResult, insights: demoInsights } = simulate(initialAudiences[0], initialCampaigns[0]);
demoResult.id = 'res-demo-001';
demoResult.job_id = 'job-demo-001';
demoResult.created_at = '2024-11-28T14:30:00Z';
demoInsights.forEach((i) => (i.result_id = 'res-demo-001'));

export const initialJobs: SimulationJob[] = [
  {
    id: 'job-demo-001',
    audience_id: 'aud-001',
    campaign_id: 'camp-001',
    status: 'done',
    progress: 100,
    started_at: '2024-11-28T14:29:00Z',
    finished_at: '2024-11-28T14:30:00Z',
  },
];

export const initialResults: SimulationResult[] = [demoResult];
export const initialInsights: Insight[] = demoInsights;
