import { useApp } from '@/context/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, PlusCircle, Play, Cpu, Sparkles, Lightbulb, GraduationCap } from 'lucide-react';
import BrandLockup from './BrandLockup';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Públicos', path: '/publicos', icon: Users },
  { label: 'Campanhas', path: '/campanhas', icon: Mail },
  { label: 'Nova Campanha', path: '/campanhas/nova', icon: PlusCircle },
  { label: 'Simulações', path: '/simular', icon: Play },
  { label: 'Performance do Modelo', path: '/performance-modelo', icon: Cpu },
  { label: 'Testes A/B', path: '/abtests', icon: Sparkles },
  { label: 'Insights', path: '/insights', icon: Lightbulb },
  { label: 'Aprender Mais', path: '/aprender-mais', icon: GraduationCap },
];

export default function TopBar() {
  const { audiences, campaigns, selectedAudienceId, selectedCampaignId, selectAudience, selectCampaign, toggleSidebar } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="h-16 rounded-2xl border border-border bg-card/95 backdrop-blur-sm shadow-[0_8px_24px_rgba(15,23,42,0.08)] flex items-center justify-between px-4 shrink-0 animate-fade-in-fast">
        <div className="flex items-center gap-2">
          <button className="md:hidden p-2 rounded-lg hover:bg-secondary" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir navegação">
            <Menu className="w-5 h-5" />
          </button>
          <button className="hidden md:inline-flex p-2 rounded-lg hover:bg-secondary" onClick={toggleSidebar} aria-label="Alternar sidebar">
            <Menu className="w-5 h-5" />
          </button>
          <BrandLockup iconSize={52} />
        </div>

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
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm animate-fade-in-fast" onClick={() => setMobileOpen(false)}>
          <div className="h-full w-[84%] max-w-[320px] bg-sidebar border-r border-sidebar-border rounded-r-3xl shadow-[0_12px_28px_rgba(15,23,42,0.2)] animate-sidebar-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
              <div className="flex items-center gap-2.5">
                <BrandLockup iconSize={52} />
              </div>
              <button className="text-textSecondary p-2" onClick={() => setMobileOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <nav className="py-4 px-3 space-y-1">
              {navItems.map((item, index) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium animate-nav-item-in ${
                      isActive ? 'bg-brand text-white shadow-[0_8px_18px_rgba(37,99,235,0.26)]' : 'text-textSecondary hover:bg-sidebar-accent hover:text-brand'
                    }`
                  }
                  style={{ animationDelay: `${Math.min(index * 20, 160)}ms` }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
