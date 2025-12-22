import { create } from 'zustand';

interface KeywordData {
    keyword: string;
    frequency: number;
}

interface QAPair {
    question: string;
    answer: string;
}

interface AnalysisResult {
    criticalMissing: KeywordData[];
    underweighted: KeywordData[];
    optimized: KeywordData[];
    suggestions: Record<string, string>; // keyword -> suggestion question
}

interface AppState {
    resumeText: string;
    jobDescription: string;
    isAnalyzing: boolean;
    analysisResult: AnalysisResult | null;
    wizardStep: 'upload' | 'analysis' | 'wizard' | 'export';
    selectedKeywords: string[];
    currentKeywordIndex: number;
    qaHistoryCurrentSession: Record<string, QAPair[]>;

    setResumeText: (text: string) => void;
    setJobDescription: (text: string) => void;
    setAnalysisResult: (result: AnalysisResult | null) => void;
    setIsAnalyzing: (isAnalyzing: boolean) => void;
    setWizardStep: (step: 'upload' | 'analysis' | 'wizard' | 'export') => void;
    toggleKeywordSelection: (keyword: string) => void;
    reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    resumeText: '',
    jobDescription: '',
    isAnalyzing: false,
    analysisResult: null,
    wizardStep: 'upload',
    selectedKeywords: [],
    currentKeywordIndex: 0,
    qaHistoryCurrentSession: {},

    setResumeText: (text) => set({ resumeText: text }),
    setJobDescription: (text) => set({ jobDescription: text }),
    setAnalysisResult: (result) => set({ analysisResult: result }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    setWizardStep: (step) => set({ wizardStep: step }),
    toggleKeywordSelection: (keyword) => set((state) => {
        const isSelected = state.selectedKeywords.includes(keyword);
        return {
            selectedKeywords: isSelected
                ? state.selectedKeywords.filter(k => k !== keyword)
                : [...state.selectedKeywords, keyword]
        };
    }),
    reset: () => set({
        resumeText: '',
        jobDescription: '',
        isAnalyzing: false,
        analysisResult: null,
        wizardStep: 'upload',
        selectedKeywords: [],
        currentKeywordIndex: 0,
        qaHistoryCurrentSession: {}
    })
}));
