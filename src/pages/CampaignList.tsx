import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Trash2 } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';

const objLabels: Record<string, string> = { awareness: 'Awareness', venda: 'Venda', conteudo: 'Conteúdo' };
const modoLabels: Record<string, string> = { editor_simples: 'Editor', template: 'Template', import_sf: 'Import SF' };

export default function CampaignList() {
  const { campaigns, deleteCampaign, selectCampaign } = useApp();

  if (campaigns.length === 0) {
    return (
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-foreground mb-6">Campanhas</h1>
        <EmptyState
          icon={<Mail className="w-8 h-8" />}
          title="Nenhuma campanha"
          description="Crie sua primeira campanha para começar a simular."
          action={<Link to="/campanhas/nova"><Button size="sm"><Plus className="w-4 h-4 mr-1" /> Nova Campanha</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campanhas</h1>
          <p className="text-sm text-muted-foreground">{campaigns.length} campanha(s) configurada(s)</p>
        </div>
        <Link to="/campanhas/nova"><Button size="sm"><Plus className="w-4 h-4 mr-1" /> Nova Campanha</Button></Link>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nome</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Subject</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Objetivo</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Modo</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tags</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-border hover:bg-muted/30 cursor-pointer" onClick={() => selectCampaign(c.id)}>
                  <td className="px-4 py-3 font-medium text-card-foreground">{c.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{c.subject}</td>
                  <td className="px-4 py-3"><Badge variant="secondary">{objLabels[c.objetivo]}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{modoLabels[c.modo]}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">{c.tags.slice(0, 2).map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteCampaign(c.id); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
