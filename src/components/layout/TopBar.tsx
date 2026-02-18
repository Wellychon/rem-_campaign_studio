import { useApp } from '@/context/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlaskConical, Menu } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, PlusCircle, Play, BarChart3, Lightbulb, GitCompareArrows, Download, Sparkles } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Públicos', path: '/publicos', icon: Users },
  { label: 'Campanhas', path: '/campanhas', icon: Mail },
  { label: 'Nova Campanha', path: '/campanhas/nova', icon: PlusCircle },
  { label: 'Simular', path: '/simular', icon: Play },
  { label: 'Resultados', path: '/resultados', icon: BarChart3 },
  { label: 'Insights', path: '/insights', icon: Lightbulb },
  { label: 'Comparar', path: '/comparar', icon: GitCompareArrows },
  { label: 'Testes A/B', path: '/abtests', icon: Sparkles },
  { label: 'Exportar', path: '/exportar', icon: Download },
];

export default function TopBar() {
  const { audiences, campaigns, selectedAudienceId, selectedCampaignId, selectAudience, selectCampaign } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <button className="md:hidden p-2 rounded-lg hover:bg-secondary" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Público:</span>
            <Select value={selectedAudienceId || ''} onValueChange={(v) => selectAudience(v || null)}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Selecionar público" />
              </SelectTrigger>
              <SelectContent>
                {audiences.map((a) => (
                  <SelectItem key={a.id} value={a.id} className="text-xs">{a.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Campanha:</span>
            <Select value={selectedCampaignId || ''} onValueChange={(v) => selectCampaign(v || null)}>
              <SelectTrigger className="w-[200px] h-8 text-xs">
                <SelectValue placeholder="Selecionar campanha" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-sidebar/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-sidebar-accent-foreground">TwinSim Email Lab</span>
            </div>
            <button className="text-sidebar-foreground p-2" onClick={() => setMobileOpen(false)}>✕</button>
          </div>
          <nav className="py-4 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
