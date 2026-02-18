import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, PlusCircle, Play, BarChart3, Lightbulb, GitCompareArrows, Download, Sparkles, Palette } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Públicos (Gêmeos)', path: '/publicos', icon: Users },
  { label: 'Campanhas', path: '/campanhas', icon: Mail, children: [{ label: 'Nova Campanha', path: '/campanhas/nova', icon: PlusCircle }] },
  { label: 'Simular', path: '/simular', icon: Play },
  { label: 'Resultados', path: '/resultados', icon: BarChart3 },
  { label: 'Insights', path: '/insights', icon: Lightbulb },
  { label: 'Comparar', path: '/comparar', icon: GitCompareArrows },
  { label: 'Testes A/B', path: '/abtests', icon: Sparkles },
  { label: 'Marca (Ramí)', path: '/marca', icon: Palette },
  { label: 'Exportar', path: '/exportar', icon: Download },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-[260px] flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <img src="/rami-logo.svg" alt="Ramí TestLab" className="h-8 w-auto" />
        <div>
          <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">Ramí TestLab</h1>
          <p className="text-[10px] text-sidebar-foreground opacity-70 -mt-0.5">Plataforma Interna de Testes</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === '/campanhas'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive || (item.children && location.pathname.startsWith(item.path))
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
            {item.children?.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-1.5 ml-7 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                <child.icon className="w-3.5 h-3.5 shrink-0" />
                {child.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground opacity-50">v1.0 — Ramí Demo</p>
      </div>
    </aside>
  );
}
