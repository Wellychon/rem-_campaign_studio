# TwinSim Campaign Studio

Plataforma web para simulação e gestão de campanhas de e-mail marketing com inteligência preditiva, baseada em grupos de audiência segmentados por clusters comportamentais (twin groups).

---

## Sumário

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#stack-tecnológica)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Uso Local](#uso-local)
- [Convenções de Desenvolvimento](#convenções-de-desenvolvimento)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)

---

## Visão Geral

O **TwinSim Campaign Studio** permite que equipes de marketing criem, configurem e simulem campanhas de e-mail antes do envio real. A plataforma calcula métricas preditivas (taxa de abertura, CTR, CTOR, bounces, descadastros, ROI) com base em clusters comportamentais da audiência, fornecendo insights acionáveis para otimização de conteúdo, timing e segmentação.

**Principais funcionalidades:**

- **Dashboard** — visão consolidada de KPIs e campanhas recentes.
- **Audiências** — gerenciamento de grupos de contatos (twin groups) segmentados por clusters.
- **Campanhas** — criação e edição de campanhas (editor simples, template ou importação).
- **Simulação** — execução de simulações preditivas combinando audiência + campanha.
- **Resultados** — análise detalhada por cluster, horário, dispositivo e ranking de links.
- **Insights** — recomendações automáticas de melhoria geradas pela engine de simulação.
- **Comparação** — confronto lado a lado de múltiplas simulações.
- **Testes A/B** — planejamento e visualização de variantes de campanha.
- **Performance do Modelo** — métricas de acurácia do modelo preditivo.
- **Exportação** — exportação de resultados para análise externa.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript 5 |
| Framework UI | React 18 |
| Build tool | Vite 5 (com plugin `@vitejs/plugin-react-swc`) |
| Estilização | Tailwind CSS 3 + CSS customizado |
| Componentes | shadcn/ui (Radix UI primitives) |
| Roteamento | React Router DOM 6 |
| Gerenciamento de estado/fetch | TanStack React Query 5 |
| Formulários | React Hook Form + Zod |
| Gráficos | Recharts 2 |
| Ícones | Lucide React |
| Temas | next-themes |
| Testes | Vitest 3 + Testing Library |
| Linting | ESLint 9 + typescript-eslint |
| Gerenciador de pacotes | npm (lock v3) / bun (lockb disponível) |

---

## Pré-requisitos

- **Node.js** >= 18 (recomendado LTS — instale via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm** >= 9 (incluído com o Node.js)

---

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Wellychon/twinsim-campaign-studio.git

# 2. Acesse o diretório do projeto
cd twinsim-campaign-studio

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:8080`.

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload na porta 8080 |
| `npm run build` | Gera o bundle de produção em `dist/` |
| `npm run build:dev` | Gera o bundle em modo desenvolvimento |
| `npm run preview` | Serve o build de produção localmente para verificação |
| `npm run lint` | Executa o ESLint em todos os arquivos do projeto |
| `npm run test` | Executa a suíte de testes uma vez (Vitest) |
| `npm run test:watch` | Executa os testes em modo watch (re-executa ao salvar) |

---

## Estrutura de Pastas

```
twinsim-campaign-studio/
├── public/                  # Ativos estáticos (favicon, logos, robots.txt)
├── src/
│   ├── components/
│   │   ├── abtests/         # Componentes de testes A/B (Badge, Tabs, VariantTree…)
│   │   ├── layout/          # Layout global (AppLayout, AppSidebar, TopBar, BrandLockup)
│   │   ├── shared/          # Componentes reutilizáveis (EmptyState, KpiCard)
│   │   ├── ui/              # Primitivos shadcn/ui (Button, Card, Dialog, Table…)
│   │   └── NavLink.tsx      # Link de navegação com estado ativo
│   ├── context/
│   │   └── AppContext.tsx   # Contexto global (audiências, campanhas, simulações)
│   ├── data/
│   │   └── mock.ts          # Dados mockados para desenvolvimento e demonstração
│   ├── hooks/
│   │   ├── use-mobile.tsx   # Hook para detecção de viewport mobile
│   │   └── use-toast.ts     # Hook para notificações toast
│   ├── lib/
│   │   ├── simulator.ts     # Engine de simulação preditiva com geração de insights
│   │   └── utils.ts         # Utilitários gerais (cn para classnames, etc.)
│   ├── pages/               # Páginas da aplicação (uma por rota)
│   │   ├── Dashboard.tsx
│   │   ├── Audiences.tsx
│   │   ├── CampaignList.tsx
│   │   ├── NewCampaign.tsx
│   │   ├── Simulate.tsx
│   │   ├── Results.tsx
│   │   ├── InsightsPage.tsx
│   │   ├── ComparePage.tsx
│   │   ├── AbTests.tsx
│   │   ├── ModelPerformance.tsx
│   │   ├── ExportPage.tsx
│   │   ├── LearnMore.tsx
│   │   ├── BrandDemo.tsx
│   │   └── NotFound.tsx
│   ├── styles/
│   │   ├── rami-brand.css   # Tokens de marca RAMI
│   │   └── remi-brand.css   # Tokens de marca REMI
│   ├── test/
│   │   ├── example.test.ts  # Teste de exemplo
│   │   └── setup.ts         # Configuração global do ambiente de testes
│   ├── types/
│   │   └── index.ts         # Interfaces TypeScript (Campaign, Audience, SimulationResult…)
│   ├── App.tsx              # Definição de rotas e providers globais
│   ├── main.tsx             # Ponto de entrada da aplicação
│   └── index.css            # Estilos globais e tokens CSS (Tailwind base)
├── components.json          # Configuração do shadcn/ui
├── eslint.config.js         # Configuração do ESLint
├── index.html               # HTML raiz (ponto de entrada do Vite)
├── postcss.config.js        # Configuração do PostCSS (autoprefixer)
├── tailwind.config.ts       # Configuração do Tailwind CSS
├── tsconfig.json            # TypeScript — configuração raiz
├── tsconfig.app.json        # TypeScript — configuração da aplicação
├── tsconfig.node.json       # TypeScript — configuração para scripts Node
├── vite.config.ts           # Configuração do Vite
└── vitest.config.ts         # Configuração do Vitest
```

---

## Uso Local

1. Após iniciar com `npm run dev`, acesse `http://localhost:8080`.
2. A rota raiz (`/`) redireciona automaticamente para `/dashboard`.
3. A aplicação roda inteiramente no lado do cliente, sem necessidade de backend: os dados são gerenciados por `AppContext` (estado React in-memory) com dados mockados em `src/data/mock.ts`.
4. A engine de simulação (`src/lib/simulator.ts`) é determinística — dadas a mesma audiência e campanha, sempre produz os mesmos resultados, o que facilita testes e comparações.

**Fluxo típico de uso:**

```
Dashboard → Audiências → Campanhas → Simular → Resultados → Insights
```

---

## Convenções de Desenvolvimento

- **TypeScript estrito** — todos os arquivos de lógica e componentes são `.ts`/`.tsx`. Evite `any`; prefira tipos explícitos definidos em `src/types/index.ts`.
- **Componentes funcionais** com hooks — sem class components.
- **Alias de importação** — use `@/` para referenciar `src/` (ex.: `import { cn } from "@/lib/utils"`).
- **Estilização** — Tailwind CSS classes como padrão primário; CSS customizado apenas em `src/styles/` para tokens de marca. Use `cn()` de `src/lib/utils.ts` para composição condicional de classes.
- **Componentes UI** — sempre prefira os primitivos de `src/components/ui/` (gerados pelo shadcn/ui) antes de criar novos componentes de baixo nível.
- **Estado global** — compartilhe dados entre páginas via `AppContext` (`src/context/AppContext.tsx`); dados de servidor/assíncronos via TanStack React Query.
- **Nomenclatura de arquivos** — PascalCase para componentes e páginas (ex.: `KpiCard.tsx`); camelCase para hooks e utilitários (ex.: `use-toast.ts`, `utils.ts`).
- **Rotas em português** — as rotas da aplicação seguem nomenclatura em pt-BR (ex.: `/campanhas`, `/simular`, `/resultados`).
- **Linting** — execute `npm run lint` antes de abrir um PR e corrija todos os erros reportados.

---

## Como Contribuir

1. **Fork** o repositório e crie um branch a partir de `main`:
   ```bash
   git checkout -b feat/nome-da-feature
   # ou
   git checkout -b fix/descricao-do-bug
   ```

2. **Implemente** suas alterações seguindo as [convenções de desenvolvimento](#convenções-de-desenvolvimento).

3. **Teste** suas alterações:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. **Commit** com mensagens claras e descritivas (preferencialmente seguindo [Conventional Commits](https://www.conventionalcommits.org/pt-br/)):
   ```bash
   git commit -m "feat: adiciona filtro por cluster na página de audiências"
   ```

5. **Abra um Pull Request** para `main` com uma descrição explicando o contexto, motivação e as principais mudanças realizadas.

6. Aguarde revisão. Após aprovação e CI verde, o PR será integrado.

---

## Licença

Este repositório não possui uma licença definida. Todos os direitos são reservados aos autores. Entre em contato com os mantenedores do repositório antes de utilizar, copiar ou distribuir este código.
