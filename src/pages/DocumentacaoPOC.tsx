import {
  FileText,
  Target,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  BarChart3,
  GitBranch,
  Users,
  FlaskConical,
  Lightbulb,
  Rocket,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
    <div className="flex items-center gap-2.5">
      <Icon className="w-5 h-5 text-brand shrink-0" />
      <h2 className="text-base font-semibold text-card-foreground">{title}</h2>
    </div>
    {children}
  </div>
);

const Pill = ({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'green' | 'orange' | 'purple' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

export default function DocumentacaoPOC() {
  return (
    <div className="space-y-8 animate-slide-up max-w-5xl">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand" />
          <h1 className="text-3xl font-bold text-textPrimary">Documentação da POC</h1>
        </div>
        <p className="text-sm text-textSecondary">
          Remí Campaign Studio — Prova de Conceito de Simulação com Gêmeos Digitais
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Pill color="blue">v1.0 — POC</Pill>
          <Pill color="green">Status: Em Validação</Pill>
          <Pill color="purple">Equipe: Produto & Dados</Pill>
        </div>
      </div>

      {/* Purpose */}
      <Section icon={Target} title="Objetivo da POC">
        <p className="text-sm text-textSecondary leading-relaxed">
          Esta POC tem como objetivo validar a viabilidade de usar <strong className="text-card-foreground">gêmeos digitais</strong> —
          perfis sintéticos que imitam o comportamento real de usuários — para prever a performance de campanhas de e-mail
          <em> antes</em> do envio real, reduzindo desperdício de alcance e aumentando a eficiência de marketing.
        </p>
        <p className="text-sm text-textSecondary leading-relaxed">
          Em vez de enviar para a base e esperar os resultados, a equipe de marketing pode simular o disparo, ajustar
          assunto, horário e segmento, e só então acionar o público real com a versão otimizada.
        </p>
      </Section>

      {/* Problem */}
      <Section icon={AlertTriangle} title="Problema que estamos resolvendo">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Testes caros e lentos',
              desc: 'A/B tests tradicionais consomem parte da base real e levam dias para gerar resultado.',
            },
            {
              title: 'Sem previsão antecipada',
              desc: 'Não há como saber o open rate antes do envio — o feedback chega tarde demais para ajuste.',
            },
            {
              title: 'Decisões baseadas em intuição',
              desc: 'Escolha de horário, segmento e assunto muitas vezes depende de experiência subjetiva.',
            },
          ].map((p) => (
            <div key={p.title} className="rounded-lg border border-border bg-secondary/40 p-4 space-y-1.5">
              <p className="text-sm font-semibold text-card-foreground">{p.title}</p>
              <p className="text-xs text-textSecondary">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Solution Overview */}
      <Section icon={BrainCircuit} title="Solução Proposta">
        <p className="text-sm text-textSecondary leading-relaxed">
          O Remí Campaign Studio combina três pilares para gerar previsões confiáveis:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Users,
              title: 'Gêmeos Digitais',
              desc: 'Perfis sintéticos clusterizados que representam segmentos da base real, com propensão de abertura, clique e descadastro.',
            },
            {
              icon: FlaskConical,
              title: 'Motor de Simulação',
              desc: 'Engine que executa campanhas contra esses perfis, retornando KPIs projetados: Open Rate, CTR, CTOR, bounces e ROI.',
            },
            {
              icon: GitBranch,
              title: 'Árvore Evolutiva A/B',
              desc: 'Loop automático que gera variantes, avalia no simulador e seleciona a vencedora — sem gastar alcance real.',
            },
          ].map((s) => (
            <div key={s.title} className="rounded-lg border border-border bg-secondary/40 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <s.icon className="w-4 h-4 text-brand" />
                <p className="text-sm font-semibold text-card-foreground">{s.title}</p>
              </div>
              <p className="text-xs text-textSecondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section icon={Layers} title="Como Funciona — Fluxo Principal">
        <ol className="space-y-3">
          {[
            { step: '1', label: 'Importar / configurar público', desc: 'Define o segmento: origem (cluster, lista salva, segmento), tamanho e atributos de saúde (opt-in, bounce histórico, engajamento).' },
            { step: '2', label: 'Criar campanha', desc: 'Configura subject, preheader, corpo do e-mail (HTML), CTA e links. Pode vir do editor interno ou de um import Salesforce.' },
            { step: '3', label: 'Rodar simulação', desc: 'O motor aplica modelos de propensão sobre os gêmeos digitais e retorna open rate, CTR, bounces, heatmap de horário e split de dispositivos.' },
            { step: '4', label: 'Analisar resultados e insights', desc: 'A IA gera recomendações automáticas de conteúdo, horário ideal, segmento com maior engajamento e alertas de deliverability.' },
            { step: '5', label: 'A/B Evolutivo (opcional)', desc: 'Cria variantes automaticamente, simula cada uma e promove a melhor versão — acelerando a otimização sem custo de alcance.' },
            { step: '6', label: 'Exportar / acionar disparo real', desc: 'Com os parâmetros otimizados, a campanha é exportada ou acionada na plataforma de envio.' },
          ].map((item) => (
            <li key={item.step} className="flex gap-4">
              <div className="flex-none flex items-center justify-center w-7 h-7 rounded-full bg-brand text-white text-xs font-bold shrink-0 mt-0.5">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">{item.label}</p>
                <p className="text-xs text-textSecondary">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* KPIs */}
      <Section icon={BarChart3} title="KPIs Monitorados pela Simulação">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Open Rate', desc: 'Taxa de abertura prevista por cluster' },
            { label: 'CTR', desc: 'Click-through rate projetado' },
            { label: 'CTOR', desc: 'Cliques sobre aberturas' },
            { label: 'Unique Clicks', desc: 'Cliques únicos estimados' },
            { label: 'Unsub Rate', desc: 'Taxa de descadastro prevista' },
            { label: 'Spam Rate', desc: 'Risco de marcar como spam' },
            { label: 'Bounce Rate', desc: 'Soft e hard bounces estimados' },
            { label: 'ROI / Conversão', desc: 'Retorno estimado quando configurado' },
          ].map((k) => (
            <div key={k.label} className="rounded-lg border border-border bg-secondary/40 p-3 space-y-1">
              <p className="text-xs font-semibold text-brand">{k.label}</p>
              <p className="text-[11px] text-textSecondary">{k.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tech Stack */}
      <Section icon={Layers} title="Stack Tecnológica da POC">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-textSecondary">Front-end</p>
            {[
              { name: 'React 18 + TypeScript', role: 'Interface do usuário' },
              { name: 'Vite', role: 'Build tool e dev server' },
              { name: 'shadcn/ui + Radix UI', role: 'Componentes acessíveis' },
              { name: 'Tailwind CSS', role: 'Estilização utilitária' },
              { name: 'Recharts', role: 'Visualizações e gráficos' },
              { name: 'TanStack Query', role: 'Cache e fetching de dados' },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-sm">
                <ArrowRight className="w-3.5 h-3.5 text-brand shrink-0" />
                <span className="font-medium text-card-foreground">{t.name}</span>
                <span className="text-textSecondary">— {t.role}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-textSecondary">Simulação / Dados</p>
            {[
              { name: 'Motor de simulação (JS)', role: 'Propensão por cluster em memória' },
              { name: 'LocalStorage', role: 'Persistência de estado da POC' },
              { name: 'Dados mock (seed)', role: 'Públicos e campanhas de demo' },
              { name: 'Vitest + Testing Library', role: 'Testes unitários' },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-sm">
                <ArrowRight className="w-3.5 h-3.5 text-brand shrink-0" />
                <span className="font-medium text-card-foreground">{t.name}</span>
                <span className="text-textSecondary">— {t.role}</span>
              </div>
            ))}
            <p className="text-xs font-semibold uppercase tracking-wide text-textSecondary mt-4">Hospedagem / Deploy</p>
            {[
              { name: 'Lovable.dev', role: 'Plataforma de preview e publicação' },
              { name: 'GitHub', role: 'Controle de versão e CI' },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-sm">
                <ArrowRight className="w-3.5 h-3.5 text-brand shrink-0" />
                <span className="font-medium text-card-foreground">{t.name}</span>
                <span className="text-textSecondary">— {t.role}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Validation Criteria */}
      <Section icon={ShieldCheck} title="Critérios de Validação da POC">
        <p className="text-sm text-textSecondary">A POC será considerada bem-sucedida se atender os seguintes critérios:</p>
        <div className="space-y-2">
          {[
            { ok: true, label: 'Interface navegável e responsiva para demonstração a stakeholders' },
            { ok: true, label: 'Simulação retornando KPIs plausíveis e consistentes com padrões de mercado' },
            { ok: true, label: 'Fluxo A/B Evolutivo demonstrável end-to-end' },
            { ok: true, label: 'Insights gerados automaticamente com base nos resultados' },
            { ok: false, label: 'Integração com dados reais da base de clientes (próxima fase)' },
            { ok: false, label: 'Modelo preditivo calibrado com histórico real (próxima fase)' },
            { ok: false, label: 'Integração com plataforma de envio (Salesforce Marketing Cloud / outro)' },
          ].map((c, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${c.ok ? 'text-green-500' : 'text-muted-foreground/40'}`} />
              <span className={c.ok ? 'text-card-foreground' : 'text-textSecondary line-through decoration-muted-foreground/40'}>
                {c.label}
              </span>
              {c.ok && <Pill color="green">Atendido</Pill>}
              {!c.ok && <Pill color="orange">Fora do escopo atual</Pill>}
            </div>
          ))}
        </div>
      </Section>

      {/* Assumptions & Limitations */}
      <Section icon={AlertTriangle} title="Premissas e Limitações">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-textSecondary mb-2">Premissas</p>
            <ul className="space-y-1.5">
              {[
                'Os clusters representam corretamente os segmentos de comportamento reais',
                'Open rate projetado varia ±5% em relação ao real (margem aceitável para decisão)',
                'O motor de simulação atual usa dados sintéticos; acurácia real depende de calibração com histórico',
              ].map((p, i) => (
                <li key={i} className="flex gap-2 text-xs text-textSecondary">
                  <span className="text-brand font-bold shrink-0">•</span> {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-textSecondary mb-2">Limitações atuais</p>
            <ul className="space-y-1.5">
              {[
                'Dados 100% mockados — sem integração com base real de clientes',
                'Sem autenticação ou controle de acesso (POC pública para demo)',
                'Persistência apenas via LocalStorage (sem backend)',
                'Modelo preditivo simples baseado em regras; não usa ML real',
              ].map((l, i) => (
                <li key={i} className="flex gap-2 text-xs text-textSecondary">
                  <span className="text-orange-500 font-bold shrink-0">•</span> {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Roadmap */}
      <Section icon={Rocket} title="Roadmap — Próximos Passos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              phase: 'Fase 1',
              label: 'POC (atual)',
              color: 'green' as const,
              items: ['Interface completa de demo', 'Motor de simulação mock', 'A/B Evolutivo demonstrável', 'Apresentação a stakeholders'],
            },
            {
              phase: 'Fase 2',
              label: 'Piloto',
              color: 'orange' as const,
              items: ['Integração com dados reais', 'Calibração do modelo preditivo', 'Autenticação e controle de acesso', 'Backend com persistência real'],
            },
            {
              phase: 'Fase 3',
              label: 'Produção',
              color: 'purple' as const,
              items: ['Integração com plataforma de envio', 'ML avançado por segmento', 'APIs abertas para parceiros', 'Automação de otimização'],
            },
          ].map((phase) => (
            <div key={phase.phase} className="rounded-lg border border-border bg-secondary/40 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Pill color={phase.color}>{phase.phase}</Pill>
                <span className="text-sm font-semibold text-card-foreground">{phase.label}</span>
              </div>
              <ul className="space-y-1.5">
                {phase.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-xs text-textSecondary">
                    <Clock className="w-3 h-3 text-brand shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Insights from the tool */}
      <Section icon={Lightbulb} title="Hipóteses a Validar com Stakeholders">
        <div className="space-y-3">
          {[
            {
              h: 'H1',
              text: 'Equipes de marketing conseguem configurar e interpretar simulações sem suporte técnico contínuo.',
              metric: 'Métrica: taxa de conclusão do fluxo de simulação sem ajuda',
            },
            {
              h: 'H2',
              text: 'O open rate simulado está dentro de ±5% do open rate real em campanhas-piloto.',
              metric: 'Métrica: erro médio absoluto (MAE) na fase de piloto',
            },
            {
              h: 'H3',
              text: 'O A/B Evolutivo reduz o tempo de definição da variante vencedora em relação ao processo manual.',
              metric: 'Métrica: tempo médio para decisão antes vs. depois da ferramenta',
            },
          ].map((hyp) => (
            <div key={hyp.h} className="rounded-lg border border-border bg-secondary/40 p-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand text-white text-xs font-bold">{hyp.h}</span>
                <p className="text-sm text-card-foreground">{hyp.text}</p>
              </div>
              <p className="text-xs text-textSecondary pl-8">{hyp.metric}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer note */}
      <div className="rounded-xl border border-border bg-brand/5 p-4">
        <p className="text-xs text-textSecondary text-center">
          Este documento é parte viva da POC e deve ser atualizado conforme as validações avançam. Última atualização: v1.0 — Remí Campaign Studio POC.
        </p>
      </div>
    </div>
  );
}
