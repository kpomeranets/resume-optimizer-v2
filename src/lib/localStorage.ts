interface QAPair {
    question: string;
    answer: string;
}

interface KeywordHistoryData {
    lastUpdated: string;
    qaHistory: QAPair[];
}

interface KeywordHistory {
    [keyword: string]: KeywordHistoryData;
}

const STORAGE_KEY = "resumeOptimizer_keywordHistory";

/**
 * Loads all keyword history from localStorage
 * @returns Object containing all keyword Q&A history
 */
export function loadKeywordHistory(): KeywordHistory {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Error loading keyword history:', error);
        return {};
    }
}

/**
 * Saves Q&A for a specific keyword
 * @param keyword - The keyword to save Q&A for
 * @param qa - The Q&A pair to save
 */
export function saveKeywordQA(keyword: string, qa: QAPair): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const history = loadKeywordHistory();

        if (!history[keyword]) {
            history[keyword] = {
                lastUpdated: new Date().toISOString(),
                qaHistory: []
            };
        }

        history[keyword].qaHistory.push(qa);
        history[keyword].lastUpdated = new Date().toISOString();

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Error saving keyword Q&A:', error);
    }
}

/**
 * Gets Q&A history for a specific keyword
 * @param keyword - The keyword to get Q&A for
 * @returns Array of Q&A pairs for the keyword
 */
export function getKeywordQA(keyword: string): QAPair[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const history = loadKeywordHistory();
        return history[keyword]?.qaHistory || [];
    } catch (error) {
        console.error('Error getting keyword Q&A:', error);
        return [];
    }
}

/**
 * Deletes all Q&A data for a specific keyword
 * @param keyword - The keyword to delete data for
 */
export function deleteKeywordQA(keyword: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const history = loadKeywordHistory();
        delete history[keyword];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Error deleting keyword Q&A:', error);
    }
}

/**
 * Clears all keyword history from localStorage
 */
export function clearAllKeywordHistory(): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing keyword history:', error);
    }
}
