import { useApp } from '@/context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Trash2, Eye, Sparkles, Monitor, Smartphone } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import type { Campaign } from '@/types';

const objLabels: Record<string, string> = { awareness: 'Awareness', venda: 'Venda', conteudo: 'Conteúdo' };
const modoLabels: Record<string, string> = { editor_simples: 'Editor', template: 'Template', import_sf: 'Import SF' };

export default function CampaignList() {
  const { campaigns, deleteCampaign, selectCampaign } = useApp();
  const navigate = useNavigate();
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

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
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ações</th>
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
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewCampaign(c);
                          setPreviewMode('desktop');
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" /> Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectCampaign(c.id);
                          navigate('/abtests');
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-brand mr-1" /> Testar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteCampaign(c.id); }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!previewCampaign} onOpenChange={(open) => !open && setPreviewCampaign(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[92vh] overflow-y-auto">
          {previewCampaign ? (
            <>
              <DialogHeader>
                <DialogTitle>Pré-visualização do E-mail</DialogTitle>
                <DialogDescription>{previewCampaign.nome}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
                  <Button
                    type="button"
                    size="sm"
                    variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                    className={previewMode === 'desktop' ? 'bg-brand text-white h-8' : 'h-8'}
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4 mr-1.5" /> Mock Desktop
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                    className={previewMode === 'mobile' ? 'bg-brand text-white h-8' : 'h-8'}
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4 mr-1.5" /> Mock Celular
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    selectCampaign(previewCampaign.id);
                    setPreviewCampaign(null);
                    navigate('/abtests');
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-1 text-brand" /> Testar na Árvore
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-4 md:p-6">
                <div
                  className={`mx-auto rounded-lg border border-border overflow-hidden bg-white transition-all duration-200 ${
                    previewMode === 'desktop' ? 'w-full max-w-[980px]' : 'w-full max-w-[390px]'
                  }`}
                >
                  <div className="px-5 py-4 border-b border-border bg-muted/40">
                    <p className="text-xs text-textSecondary">De: {previewCampaign.remetente_from_name} &lt;{previewCampaign.remetente_from_email}&gt;</p>
                    <p className="text-sm font-semibold text-card-foreground mt-1">{previewCampaign.subject}</p>
                    <p className="text-xs text-textSecondary mt-1">{previewCampaign.preheader}</p>
                  </div>
                  <div className="p-5 md:p-6">
                    <div
                      className="prose prose-sm max-w-none text-card-foreground"
                      dangerouslySetInnerHTML={{ __html: previewCampaign.body_html }}
                    />
                    <div className="mt-5">
                      <a
                        href={previewCampaign.links[0]?.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
                      >
                        {previewCampaign.cta_principal}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
