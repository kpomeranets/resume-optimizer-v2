import { create } from 'zustand';

interface KeywordAnalysis {
    keyword: string;
    frequency: number;
}

interface AnalysisResult {
    criticalMissing: KeywordAnalysis[];
    underweighted: KeywordAnalysis[];
    optimized: KeywordAnalysis[];
    suggestions: Record<string, string>; // keyword -> suggestion question
}

interface OptimizedBullet {
    original: string;
    optimized: string;
    explanation: string;
    keywords: string[];
    section: string;
    status?: 'pending' | 'approved' | 'rejected' | 'edited';
    editedText?: string;
}

interface AppState {
    resumeText: string;
    jobDescription: string;
    isAnalyzing: boolean;
    analysisResult: AnalysisResult | null;
    optimizedBullets: OptimizedBullet[];
    wizardStep: 'upload' | 'analysis' | 'wizard' | 'recommendations' | 'export';

    setResumeText: (text: string) => void;
    setJobDescription: (text: string) => void;
    setAnalysisResult: (result: AnalysisResult | null) => void;
    setIsAnalyzing: (isAnalyzing: boolean) => void;
    setOptimizedBullets: (bullets: OptimizedBullet[]) => void;
    setWizardStep: (step: 'upload' | 'analysis' | 'wizard' | 'recommendations' | 'export') => void;
    reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    resumeText: '',
    jobDescription: '',
    isAnalyzing: false,
    analysisResult: null,
    optimizedBullets: [],
    wizardStep: 'upload',

    setResumeText: (text) => set({ resumeText: text }),
    setJobDescription: (text) => set({ jobDescription: text }),
    setAnalysisResult: (result) => set({ analysisResult: result }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    setOptimizedBullets: (bullets) => set({ optimizedBullets: bullets }),
    setWizardStep: (step) => set({ wizardStep: step }),
    reset: () => set({
        resumeText: '',
        jobDescription: '',
        isAnalyzing: false,
        analysisResult: null,
        optimizedBullets: [],
        wizardStep: 'upload'
    })
}));
