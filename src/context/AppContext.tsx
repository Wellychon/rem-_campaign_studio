import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AudienceTwinGroup, Campaign, SimulationJob, SimulationResult, Insight } from '@/types';
import { initialAudiences, initialCampaigns, initialJobs, initialResults, initialInsights } from '@/data/mock';
import { simulate } from '@/lib/simulator';

interface AppState {
  audiences: AudienceTwinGroup[];
  campaigns: Campaign[];
  jobs: SimulationJob[];
  results: SimulationResult[];
  insights: Insight[];
  selectedAudienceId: string | null;
  selectedCampaignId: string | null;
  sidebarOpen: boolean;
}

interface AppContextType extends AppState {
  selectAudience: (id: string | null) => void;
  selectCampaign: (id: string | null) => void;
  addAudience: (a: AudienceTwinGroup) => void;
  addCampaign: (c: Campaign) => void;
  deleteCampaign: (id: string) => void;
  startSimulation: (audienceId: string, campaignId: string) => string;
  completeSimulation: (jobId: string) => void;
  getAudience: (id: string) => AudienceTwinGroup | undefined;
  getCampaign: (id: string) => Campaign | undefined;
  getResult: (id: string) => SimulationResult | undefined;
  getResultForJob: (jobId: string) => SimulationResult | undefined;
  getInsightsForResult: (resultId: string) => Insight[];
  getResultsWithDetails: () => Array<SimulationResult & { audienceName: string; campaignName: string }>;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const STORAGE_KEY = 'twinsim-state';

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    audiences: initialAudiences,
    campaigns: initialCampaigns,
    jobs: initialJobs,
    results: initialResults,
    insights: initialInsights,
    selectedAudienceId: 'aud-001',
    selectedCampaignId: 'camp-001',
    sidebarOpen: true,
  };
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const s = loadState();
    // Backward compatibility if stored state lacks sidebarOpen
    if (typeof (s as any).sidebarOpen === 'undefined') {
      (s as any).sidebarOpen = true;
    }
    return s;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const selectAudience = useCallback((id: string | null) => setState((s) => ({ ...s, selectedAudienceId: id })), []);
  const selectCampaign = useCallback((id: string | null) => setState((s) => ({ ...s, selectedCampaignId: id })), []);

  const addAudience = useCallback((a: AudienceTwinGroup) => setState((s) => ({ ...s, audiences: [...s.audiences, a] })), []);
  const addCampaign = useCallback((c: Campaign) => setState((s) => ({ ...s, campaigns: [...s.campaigns, c] })), []);
  const deleteCampaign = useCallback((id: string) => setState((s) => ({ ...s, campaigns: s.campaigns.filter((c) => c.id !== id) })), []);
  const setSidebarOpen = useCallback((open: boolean) => setState((s) => ({ ...s, sidebarOpen: open })), []);
  const toggleSidebar = useCallback(() => setState((s) => ({ ...s, sidebarOpen: !s.sidebarOpen })), []);

  const startSimulation = useCallback((audienceId: string, campaignId: string) => {
    const jobId = `job-${Date.now()}`;
    const job: SimulationJob = { id: jobId, audience_id: audienceId, campaign_id: campaignId, status: 'running', progress: 0, started_at: new Date().toISOString() };
    setState((s) => ({ ...s, jobs: [...s.jobs, job] }));
    return jobId;
  }, []);

  const completeSimulation = useCallback((jobId: string) => {
    setState((s) => {
      const job = s.jobs.find((j) => j.id === jobId);
      if (!job) return s;
      const audience = s.audiences.find((a) => a.id === job.audience_id);
      const campaign = s.campaigns.find((c) => c.id === job.campaign_id);
      if (!audience || !campaign) return s;

      const { result, insights: newInsights } = simulate(audience, campaign);
      result.job_id = jobId;

      const updatedJobs = s.jobs.map((j) => (j.id === jobId ? { ...j, status: 'done' as const, progress: 100, finished_at: new Date().toISOString() } : j));

      return { ...s, jobs: updatedJobs, results: [...s.results, result], insights: [...s.insights, ...newInsights] };
    });
  }, []);

  const getAudience = useCallback((id: string) => state.audiences.find((a) => a.id === id), [state.audiences]);
  const getCampaign = useCallback((id: string) => state.campaigns.find((c) => c.id === id), [state.campaigns]);
  const getResult = useCallback((id: string) => state.results.find((r) => r.id === id), [state.results]);
  const getResultForJob = useCallback((jobId: string) => state.results.find((r) => r.job_id === jobId), [state.results]);
  const getInsightsForResult = useCallback((resultId: string) => state.insights.filter((i) => i.result_id === resultId), [state.insights]);

  const getResultsWithDetails = useCallback(() => {
    return state.results.map((r) => ({
      ...r,
      audienceName: state.audiences.find((a) => a.id === r.audience_id)?.nome || 'Desconhecido',
      campaignName: state.campaigns.find((c) => c.id === r.campaign_id)?.nome || 'Desconhecida',
    }));
  }, [state.results, state.audiences, state.campaigns]);

  return (
    <AppContext.Provider
      value={{ ...state, selectAudience, selectCampaign, addAudience, addCampaign, deleteCampaign, startSimulation, completeSimulation, getAudience, getCampaign, getResult, getResultForJob, getInsightsForResult, getResultsWithDetails, setSidebarOpen, toggleSidebar }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
