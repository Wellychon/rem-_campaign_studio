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
    body_html:
      '<div style="max-width:620px;margin:0 auto;font-family:Inter,Segoe UI,Arial,sans-serif;color:#111827;line-height:1.55;"><div style="padding:20px 0;border-bottom:1px solid #E5E7EB;"><img src="/logo.png" alt="Remí" style="width:38px;height:38px;vertical-align:middle;border-radius:8px;"/><span style="font-size:20px;font-weight:700;margin-left:10px;vertical-align:middle;">Remí</span></div><div style="padding:24px 0;"><p style="font-size:12px;color:#6B7280;margin:0 0 10px;">Oferta VIP • Black Friday</p><h1 style="font-size:28px;line-height:1.2;margin:0 0 16px;">Até 60% OFF em itens selecionados</h1><p style="margin:0 0 14px;">Olá! Selecionamos uma vitrine especial para o seu perfil com descontos agressivos em produtos de alta conversão.</p><p style="margin:0 0 14px;">A campanha fica disponível até hoje às 23:59 e alguns itens já estão em baixa disponibilidade.</p><ul style="margin:0 0 16px 18px;padding:0;"><li>Frete grátis acima de R$199</li><li>Cupom extra para clientes recorrentes</li><li>Parcelamento em até 10x sem juros</li></ul><p style="margin:0 0 18px;">Clique no botão para abrir sua vitrine personalizada.</p><a href="https://loja.exemplo.com/blackfriday" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;">Garantir Minha Oferta</a></div><div style="border-top:1px solid #E5E7EB;padding:18px 0 6px;"><p style="font-size:12px;color:#6B7280;margin:0 0 6px;">Você recebeu este e-mail por estar inscrito(a) nas comunicações da Remí.</p><p style="font-size:12px;color:#6B7280;margin:0;">Remí • Av. Paulista, 1000 • São Paulo/SP • <a href="#" style="color:#2563EB;">Cancelar inscrição</a></p></div></div>',
    body_text:
      'Oferta VIP Black Friday: até 60% OFF em itens selecionados. A campanha fica disponível até 23:59, com frete grátis acima de R$199, cupom extra para clientes recorrentes e parcelamento em até 10x sem juros. Acesse sua vitrine personalizada e aproveite as ofertas de hoje.',
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
    body_html:
      '<div style="max-width:620px;margin:0 auto;font-family:Inter,Segoe UI,Arial,sans-serif;color:#111827;line-height:1.55;"><div style="padding:20px 0;border-bottom:1px solid #E5E7EB;"><img src="/logo.png" alt="Remí" style="width:38px;height:38px;vertical-align:middle;border-radius:8px;"/><span style="font-size:20px;font-weight:700;margin-left:10px;vertical-align:middle;">Remí</span></div><div style="padding:24px 0;"><p style="font-size:12px;color:#6B7280;margin:0 0 10px;">Newsletter mensal • Edição de Janeiro</p><h1 style="font-size:26px;line-height:1.25;margin:0 0 16px;">Tendências e ações práticas para começar 2025</h1><p style="margin:0 0 14px;">Preparamos uma edição objetiva para você tomar decisões melhores nas próximas campanhas.</p><h3 style="font-size:18px;margin:18px 0 8px;">Nesta edição</h3><ol style="margin:0 0 16px 18px;padding:0;"><li>Tendências de comportamento de compra no digital</li><li>Checklist de automações para aumentar conversão</li><li>Benchmark de campanhas por segmento</li><li>2 testes A/B que você pode rodar esta semana</li></ol><p style="margin:0 0 18px;">Tempo de leitura: 4 minutos.</p><a href="https://blog.exemplo.com" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;">Ler Matéria Completa</a></div><div style="border-top:1px solid #E5E7EB;padding:18px 0 6px;"><p style="font-size:12px;color:#6B7280;margin:0 0 6px;">Equipe de Conteúdo Remí</p><p style="font-size:12px;color:#6B7280;margin:0;">Preferências de e-mail • <a href="#" style="color:#2563EB;">Gerenciar assinatura</a></p></div></div>',
    body_text:
      'Newsletter de Janeiro com tendências de compra digital, checklist de automações, benchmark por segmento e testes A/B recomendados para a semana. Leitura rápida com ações práticas para melhorar performance.',
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
    body_html:
      '<div style="max-width:620px;margin:0 auto;font-family:Inter,Segoe UI,Arial,sans-serif;color:#111827;line-height:1.55;"><div style="padding:20px 0;border-bottom:1px solid #E5E7EB;"><img src="/logo.png" alt="Remí" style="width:38px;height:38px;vertical-align:middle;border-radius:8px;"/><span style="font-size:20px;font-weight:700;margin-left:10px;vertical-align:middle;">Remí</span></div><div style="padding:24px 0;"><p style="font-size:12px;color:#6B7280;margin:0 0 10px;">Convite oficial • Evento ao vivo</p><h1 style="font-size:26px;line-height:1.25;margin:0 0 16px;">Webinar: Tendências Digitais 2025</h1><p style="margin:0 0 14px;">Você está convidado(a) para uma sessão exclusiva com especialistas em CRM, dados e performance.</p><div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:12px 14px;margin:0 0 16px;"><p style="margin:0 0 4px;"><strong>Data:</strong> 10/02</p><p style="margin:0 0 4px;"><strong>Horário:</strong> 14h (BRT)</p><p style="margin:0;"><strong>Duração:</strong> 50 min + Q&A</p></div><p style="margin:0 0 18px;">Ao confirmar presença, você recebe o link da transmissão e o material de apoio em PDF.</p><a href="https://eventos.exemplo.com/webinar-2025" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;">Inscrever-se Agora</a></div><div style="border-top:1px solid #E5E7EB;padding:18px 0 6px;"><p style="font-size:12px;color:#6B7280;margin:0 0 6px;">Eventos Remí • Conteúdo para líderes de marketing</p><p style="font-size:12px;color:#6B7280;margin:0;">Dúvidas? responda este e-mail • <a href="#" style="color:#2563EB;">Política de privacidade</a></p></div></div>',
    body_text:
      'Convite para webinar ao vivo em 10/02 às 14h com especialistas em CRM, dados e performance. Duração de 50 minutos + perguntas. Inscreva-se para receber o link e material de apoio.',
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
