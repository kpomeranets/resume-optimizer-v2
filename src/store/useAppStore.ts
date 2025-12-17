import { create } from 'zustand';

interface AnalysisResult {
    criticalMissing: string[];
    underweighted: string[];
    optimized: string[];
    suggestions: Record<string, string>; // keyword -> suggestion question
}

interface AppState {
    resumeText: string;
    jobDescription: string;
    isAnalyzing: boolean;
    analysisResult: AnalysisResult | null;
    wizardStep: 'upload' | 'analysis' | 'wizard' | 'export';

    setResumeText: (text: string) => void;
    setJobDescription: (text: string) => void;
    setAnalysisResult: (result: AnalysisResult | null) => void;
    setIsAnalyzing: (isAnalyzing: boolean) => void;
    setWizardStep: (step: 'upload' | 'analysis' | 'wizard' | 'export') => void;
    reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    resumeText: '',
    jobDescription: '',
    isAnalyzing: false,
    analysisResult: null,
    wizardStep: 'upload',

    setResumeText: (text) => set({ resumeText: text }),
    setJobDescription: (text) => set({ jobDescription: text }),
    setAnalysisResult: (result) => set({ analysisResult: result }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    setWizardStep: (step) => set({ wizardStep: step }),
    reset: () => set({
        resumeText: '',
        jobDescription: '',
        isAnalyzing: false,
        analysisResult: null,
        wizardStep: 'upload'
    })
}));
