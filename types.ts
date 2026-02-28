export interface UserInfo {
  name: string;
  email: string;
}

export interface ChatEntry {
  role: 'user' | 'model';
  text: string;
}

export interface AnalysisRequest {
  statements: string;
  file: File | null;
  industry: 'manufacturing' | 'service';
  companyType: 'public' | 'private';
  country: string;
  guidanceMode: 'secular' | 'faith-based';
  userInfo: UserInfo | null;
  isDemo?: boolean;
}

export interface Recommendation {
  title: string;
  description: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface Phase {
  title: string;
  description: string;
  recommendations: Recommendation[];
}

export interface Resource {
  name: string;
  url: string; 
}

export interface AnalysisResult {
  zScore: number;
  zone: 'safe' | 'caution' | 'distress';
  zScoreModelUsed: string; // e.g., "Z''-Score"
  zScoreModelDescription: string; // e.g., "The model for non-manufacturing firms..."
  zScoreModelBenchmarks: { // e.g., { distress: "< 1.10", caution: "1.10 - 2.60", safe: "> 2.60" }
    distress: string;
    caution: string;
    safe: string;
  };
  explanation: string; // This will now contain Markdown
  turnaroundPlan: Phase[];
  sources: Source[];
  spiritualPerspective?: string; // Optional Markdown content for faith-based guidance
  helpfulResources?: Resource[]; // Optional list of resource centers with links
}

export interface TrainingScenario {
  title: string;
  description: string;
  choices: string[];
  requiresInput: boolean;
  category: 'Z-Score' | 'Financial Ratio';
}