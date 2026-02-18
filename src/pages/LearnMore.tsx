import { BrainCircuit, Bot, GitBranch, ArrowRight } from 'lucide-react';

export default function LearnMore() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold text-textPrimary">Aprender Mais</h1>
        <p className="text-sm text-textSecondary mt-1">Como os gêmeos digitais e a árvore evolutiva funcionam, de forma simples.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-brand" />
            <h2 className="text-base font-semibold text-card-foreground">O que são gêmeos digitais?</h2>
          </div>
          <p className="text-sm text-textSecondary">
            É como se a máquina criasse “usuários virtuais” para imitar comportamento real: quem abre, quem clica e quem ignora.
          </p>
          <p className="text-sm text-textSecondary">
            Assim, o teste roda primeiro nesses perfis simulados e você ajusta a campanha antes de enviar para pessoas reais.
          </p>
          <div className="rounded-lg border border-border bg-secondary/40 p-4">
            <p className="text-xs text-textSecondary">Taxa de erro (explicação simples)</p>
            <p className="text-sm text-card-foreground mt-1">
              O modelo não acerta 100%. Normalmente existe uma margem. Exemplo: prever 30% e o real vir 28% ou 32%.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-brand" />
            <h2 className="text-base font-semibold text-card-foreground">Fluxo da árvore evolutiva</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border bg-secondary/40 p-3 text-sm">
              <p className="font-medium text-card-foreground">1. Gera 2 versões</p>
              <p className="text-textSecondary text-xs mt-1">Rodada cria duas variantes.</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/40 p-3 text-sm">
              <p className="font-medium text-card-foreground">2. Avalia</p>
              <p className="text-textSecondary text-xs mt-1">Open, CTR e score.</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/40 p-3 text-sm">
              <p className="font-medium text-card-foreground">3. Escolhe</p>
              <p className="text-textSecondary text-xs mt-1">Uma aprova, outra corta.</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/40 p-3 text-sm">
              <p className="font-medium text-card-foreground">4. Evolui</p>
              <p className="text-textSecondary text-xs mt-1">Vencedora segue adiante.</p>
            </div>
          </div>

          <div className="relative rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs text-card-foreground font-medium">
                <Bot className="w-3.5 h-3.5 text-brand animate-ai-work" />
                Máquina testando
              </span>
              <span className="text-xs text-textSecondary">loop contínuo</span>
            </div>
            <div className="mt-4 relative h-7 flex items-center">
              <div className="absolute h-px w-full bg-border" />
              <div className="absolute h-px w-full bg-brand/40 animate-light-travel" />
              <div className="absolute left-[15%] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-brand/70" />
              <div className="absolute left-[50%] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-brand/70" />
              <div className="absolute right-[15%] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-brand/70" />
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-textSecondary">
              <span>Rodada</span>
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Decisão</span>
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Próxima Rodada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
