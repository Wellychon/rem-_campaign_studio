export type VariantStatus = 'root' | 'approved' | 'rejected' | 'candidate';

export interface VariantMetrics {
  openRate: number;
  ctr: number;
  score: number;
  confidence: number;
}

export interface VariantNodeData {
  id: string;
  name: string;
  generation: number;
  parentId: string | null;
  status: VariantStatus;
  metrics: VariantMetrics;
  alterations: string[];
  reason: string;
  timestamp: string;
  audienceName: string;
}
