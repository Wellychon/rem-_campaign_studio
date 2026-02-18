import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, PlusCircle, Play, Cpu, Sparkles, Lightbulb, GraduationCap } from 'lucide-react';
import BrandLockup from './BrandLockup';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Públicos (Gêmeos)', path: '/publicos', icon: Users },
  { label: 'Campanhas', path: '/campanhas', icon: Mail, children: [{ label: 'Nova Campanha', path: '/campanhas/nova', icon: PlusCircle }] },
  { label: 'Simulações', path: '/simular', icon: Play },
  { label: 'Performance do Modelo', path: '/performance-modelo', icon: Cpu },
  { label: 'Testes A/B', path: '/abtests', icon: Sparkles },
  { label: 'Insights', path: '/insights', icon: Lightbulb },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-[272px] h-[calc(100vh-2rem)] sticky top-4 flex-col bg-sidebar text-sidebar-foreground border border-sidebar-border rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] shrink-0 animate-sidebar-in overflow-hidden">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <BrandLockup iconSize={52} />
      </div>

      <nav className="flex-1 py-5 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => (
          <div key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === '/campanhas'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors animate-nav-item-in ${
                  isActive || (item.children && location.pathname.startsWith(item.path))
                    ? 'bg-brand text-white shadow-[0_8px_18px_rgba(37,99,235,0.26)]'
                    : 'text-textSecondary hover:bg-sidebar-accent hover:text-brand'
                }`
              }
              style={{ animationDelay: `${Math.min(index * 25, 180)}ms` }}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
            {item.children?.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-1.5 ml-7 rounded-xl text-xs font-medium transition-colors ${
                    isActive ? 'bg-brand text-white shadow-[0_8px_18px_rgba(37,99,235,0.26)]' : 'text-textSecondary hover:bg-sidebar-accent hover:text-brand'
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
        <NavLink
          to="/aprender-mais"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              isActive ? 'bg-brand text-white shadow-[0_8px_18px_rgba(37,99,235,0.26)]' : 'text-textSecondary hover:bg-sidebar-accent hover:text-brand'
            }`
          }
        >
          <GraduationCap className="w-4 h-4 shrink-0" />
          Aprender Mais
        </NavLink>
      </div>

      <div className="px-4 py-3 border-t border-sidebar-border bg-gradient-to-r from-brand-50 to-transparent">
        <p className="text-[10px] text-textSecondary">v1.0 - Remí Demo</p>
      </div>
    </aside>
  );
}
