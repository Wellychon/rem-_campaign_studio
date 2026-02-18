import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import { useApp } from '@/context/AppContext';
import TopBar from './TopBar';

export default function AppLayout() {
  const { sidebarOpen } = useApp();
  return (
    <div className="flex min-h-screen bg-background p-3 md:p-4 gap-3 md:gap-4">
      {sidebarOpen && <AppSidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto px-2 pt-4 pb-2 md:px-3 md:pt-5 md:pb-3 space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
