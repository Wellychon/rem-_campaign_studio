import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import type { Campaign } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

const templates = {
  promo: { subject: '🎉 Promoção Imperdível — Até 50% OFF!', preheader: 'Ofertas por tempo limitado', body: 'Aproveite descontos exclusivos em produtos selecionados.', cta: 'Ver Ofertas' },
  newsletter: { subject: 'Newsletter — Novidades da Semana', preheader: 'As melhores notícias para você', body: 'Confira o que aconteceu nesta semana.', cta: 'Ler Mais' },
  evento: { subject: '📅 Evento Exclusivo — Inscreva-se!', preheader: 'Vagas limitadas', body: 'Participe do nosso evento exclusivo.', cta: 'Inscrever-se' },
};

const sfMock = {
  subject: '[SF] Re-engagement: Clientes inativos 90d',
  preheader: 'Sentimos sua falta!',
  body: 'Importado de Salesforce Marketing Cloud. Segmento: Clientes inativos há 90 dias. Regras: último pedido > 90d, email válido, opt-in ativo.',
  cta: 'Voltar à Loja',
};

export default function NewCampaign() {
  const { addCampaign, selectCampaign } = useApp();
  const navigate = useNavigate();
  const [modo, setModo] = useState<'editor_simples' | 'template' | 'import_sf'>('editor_simples');
  const [form, setForm] = useState({ nome: '', subject: '', preheader: '', body: '', cta: '', links: '' as string, fromName: '', fromEmail: '', objetivo: 'awareness' as Campaign['objetivo'], frequencia: 'unica', tags: '', abtest: false });

  const u = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const applyTemplate = (key: keyof typeof templates) => {
    const t = templates[key];
    setForm((f) => ({ ...f, subject: t.subject, preheader: t.preheader, body: t.body, cta: t.cta }));
  };

  const applyImportSF = () => {
    setForm((f) => ({ ...f, subject: sfMock.subject, preheader: sfMock.preheader, body: sfMock.body, cta: sfMock.cta }));
  };

  const handleSave = () => {
    if (!form.nome || !form.subject) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha ao menos nome e assunto.', variant: 'destructive' });
      return;
    }
    const links = form.links ? form.links.split('\n').map((l) => { const [label, url] = l.split('|'); return { label: label?.trim() || 'Link', url: url?.trim() || '#' }; }) : [];
    const campaign: Campaign = {
      id: `camp-${Date.now()}`,
      nome: form.nome,
      modo,
      subject: form.subject,
      preheader: form.preheader,
      body_html: `<p>${form.body}</p>`,
      body_text: form.body,
      cta_principal: form.cta || 'Saiba Mais',
      links,
      remetente_from_name: form.fromName || 'TwinSim Lab',
      remetente_from_email: form.fromEmail || 'lab@twinsim.com',
      objetivo: form.objetivo,
      data_hora_planejada: new Date().toISOString(),
      frequencia: form.frequencia,
      tags: [...(form.tags ? form.tags.split(',').map((t) => t.trim()) : []), ...(form.abtest ? ['abtest'] : [])],
    };
    addCampaign(campaign);
    selectCampaign(campaign.id);
    toast({ title: 'Campanha criada!', description: campaign.nome });
    navigate('/campanhas');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nova Campanha</h1>
        <p className="text-sm text-muted-foreground">Configure o conteúdo e metadados da campanha</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-5">
        <div><Label>Nome da Campanha *</Label><Input value={form.nome} onChange={(e) => u('nome', e.target.value)} placeholder="Ex: Black Friday 2024" /></div>

        <Tabs value={modo} onValueChange={(v: any) => setModo(v)}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="editor_simples">Editor Simples</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="import_sf">Import SF</TabsTrigger>
          </TabsList>

          <TabsContent value="editor_simples" className="space-y-4 mt-4">
            <div><Label>Assunto *</Label><Input value={form.subject} onChange={(e) => u('subject', e.target.value)} placeholder="Assunto do email" /></div>
            <div><Label>Preheader</Label><Input value={form.preheader} onChange={(e) => u('preheader', e.target.value)} placeholder="Texto de pré-visualização" /></div>
            <div><Label>Corpo do Email</Label><Textarea value={form.body} onChange={(e) => u('body', e.target.value)} placeholder="Conteúdo do email" rows={5} /></div>
            <div><Label>CTA Principal</Label><Input value={form.cta} onChange={(e) => u('cta', e.target.value)} placeholder="Ex: Comprar Agora" /></div>
            <div><Label>Links (um por linha: label|url)</Label><Textarea value={form.links} onChange={(e) => u('links', e.target.value)} placeholder="Ver Ofertas|https://..." rows={3} /></div>
          </TabsContent>

          <TabsContent value="template" className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">Selecione um template para preencher automaticamente:</p>
            <div className="flex gap-2 mb-4">
              {Object.entries(templates).map(([key, t]) => (
                <Button key={key} variant="outline" size="sm" onClick={() => applyTemplate(key as keyof typeof templates)}>{key === 'promo' ? '🛍 Promo' : key === 'newsletter' ? '📰 Newsletter' : '📅 Evento'}</Button>
              ))}
            </div>
            <div className="space-y-3">
              <div><Label>Assunto</Label><Input value={form.subject} onChange={(e) => u('subject', e.target.value)} /></div>
              <div><Label>Preheader</Label><Input value={form.preheader} onChange={(e) => u('preheader', e.target.value)} /></div>
              <div><Label>Corpo</Label><Textarea value={form.body} onChange={(e) => u('body', e.target.value)} rows={4} /></div>
              <div><Label>CTA</Label><Input value={form.cta} onChange={(e) => u('cta', e.target.value)} /></div>
            </div>
          </TabsContent>

          <TabsContent value="import_sf" className="mt-4">
            <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-3">Importar campanha do Salesforce Marketing Cloud</p>
              <Button variant="outline" onClick={applyImportSF}>Importar Campanha (Mock)</Button>
            </div>
            {form.subject && (
              <div className="mt-4 space-y-3">
                <div><Label>Assunto</Label><Input value={form.subject} onChange={(e) => u('subject', e.target.value)} /></div>
                <div><Label>Corpo</Label><Textarea value={form.body} onChange={(e) => u('body', e.target.value)} rows={4} /></div>
                <div><Label>CTA</Label><Input value={form.cta} onChange={(e) => u('cta', e.target.value)} /></div>
              </div>
            )}
          </TabsContent>
        </Tabs>

  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div><Label>Remetente (Nome)</Label><Input value={form.fromName} onChange={(e) => u('fromName', e.target.value)} placeholder="Nome do remetente" /></div>
          <div><Label>Remetente (Email)</Label><Input value={form.fromEmail} onChange={(e) => u('fromEmail', e.target.value)} placeholder="email@empresa.com" /></div>
          <div>
            <Label>Objetivo</Label>
            <Select value={form.objetivo} onValueChange={(v: any) => u('objetivo', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="awareness">Awareness</SelectItem>
                <SelectItem value="venda">Venda</SelectItem>
                <SelectItem value="conteudo">Conteúdo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Frequência</Label>
            <Select value={form.frequencia} onValueChange={(v) => u('frequencia', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unica">Única</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="diaria">Diária</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input id="abtest" type="checkbox" checked={form.abtest} onChange={(e) => u('abtest', e.target.checked ? 'true' as any : '' as any)} />
            <label htmlFor="abtest" className="text-sm text-card-foreground">Participar de A/B</label>
          </div>
          <div className="col-span-2"><Label>Tags (separadas por vírgula)</Label><Input value={form.tags} onChange={(e) => u('tags', e.target.value)} placeholder="promo, black-friday" /></div>
        </div>

        <Button onClick={handleSave} className="w-full">Salvar Campanha</Button>
      </div>
    </div>
  );
}
