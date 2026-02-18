import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Audiences from "@/pages/Audiences";
import CampaignList from "@/pages/CampaignList";
import NewCampaign from "@/pages/NewCampaign";
import Simulate from "@/pages/Simulate";
import Results from "@/pages/Results";
import InsightsPage from "@/pages/InsightsPage";
import ComparePage from "@/pages/ComparePage";
import ExportPage from "@/pages/ExportPage";
import NotFound from "@/pages/NotFound";
import AbTests from "@/pages/AbTests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/publicos" element={<Audiences />} />
              <Route path="/campanhas" element={<CampaignList />} />
              <Route path="/campanhas/nova" element={<NewCampaign />} />
              <Route path="/simular" element={<Simulate />} />
              <Route path="/resultados" element={<Results />} />
              <Route path="/resultados/:id" element={<Results />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/comparar" element={<ComparePage />} />
              <Route path="/abtests" element={<AbTests />} />
              <Route path="/exportar" element={<ExportPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
