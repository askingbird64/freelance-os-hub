export interface RawContent {
  id: number;
  sourceType: string;
  subreddit: string;
  rawText: string;
  url: string;
}

export interface PainCluster {
  id: number;
  clusterName: string;
  clusterSummary: string;
  frequencyScore: number;
  opportunityScore: number;
}

export interface ExtractedPain {
  id: number;
  painPoint: string;
  desiredOutcome: string;
  clusterId: number;
}

export interface ExportFormat {
  type: string;
  content: string;
}

export interface AppState {
  status: "IDLE" | "CRAWLING" | "EXTRACTING" | "CLUSTERING" | "EXPORTING" | "DONE" | "ERROR";
  jobId: number | null;
  logs: string[];
  rawContents: RawContent[];
  clusters: PainCluster[];
  pains: ExtractedPain[];
  exports: ExportFormat[];
  activeExport: string | null;
  config: any;
}
