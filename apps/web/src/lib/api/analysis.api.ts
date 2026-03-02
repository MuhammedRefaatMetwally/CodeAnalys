import api from '../axios';

export interface Analysis {
  id: string;
  prUrl: string;
  repoName: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  overallScore: number | null;
  result: AnalysisResult | null;
  createdAt: string;
}

export interface AnalysisResult {
  overallScore: number;
  summary: string;
  files: FileAnalysis[];
}

export interface FileAnalysis {
  filename: string;
  summary: string;
  issues: Issue[];
}

export interface Issue {
  severity: 'critical' | 'warning' | 'suggestion';
  message: string;
  line?: number;
}

export const analysisApi = {
  create: async (prUrl: string) => {
    const res = await api.post<Analysis>('/analysis', { prUrl });
    return res.data;
  },
  getAll: async () => {
    const res = await api.get<Analysis[]>('/analysis');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get<Analysis>(`/analysis/${id}`);
    return res.data;
  },
};