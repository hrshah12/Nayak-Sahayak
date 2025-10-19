import { CaseData } from './services/caseDataService';

export interface AnalysisResult {
  summary: string;
  category: 'Criminal' | 'Civil' | 'Constitutional' | 'Corporate' | 'Family' | 'Tax' | 'Other';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  priorityScore: number;
  priorityJustification: string;
  preliminaryAssessment: string;
  fastTrack: boolean;
  fastTrackJustification: string;
}

export interface AnalyzedCase extends CaseData, AnalysisResult {}