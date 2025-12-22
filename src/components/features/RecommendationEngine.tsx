"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

interface Suggestion {
    original: string;
    optimized: string;
    explanation: string;
    keywords: string[];
    section: string;
    status?: 'pending' | 'approved' | 'rejected' | 'edited';
    editedText?: string;
}

export function RecommendationEngine() {
    const resumeText = useAppStore((state) => state.resumeText);
    const jobDescription = useAppStore((state) => state.jobDescription);
    const analysisResult = useAppStore((state) => state.analysisResult);
    const setOptimizedBullets = useAppStore((state) => state.setOptimizedBullets);
    const setWizardStep = useAppStore((state) => state.setWizardStep);

    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        generateSuggestions();
    }, []);

    const generateSuggestions = async () => {
        if (!resumeText || !jobDescription || !analysisResult) {
            setError("Missing required data for optimization");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeText,
                    jobDescription,
                    analysisResult,
                    userAnswers: [] // TODO: Get from chat history
                })
            });

            if (!res.ok) {
                throw new Error('Failed to generate optimizations');
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            if (!reader) {
                throw new Error('No response body');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                fullText += decoder.decode(value, { stream: true });
            }

            console.log('[RecommendationEngine] Raw response:', fullText);

            // Extract JSON from response (handle markdown code blocks)
            let jsonText = fullText.trim();
            const jsonMatch = fullText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            }

            const parsed = JSON.parse(jsonText);
            const suggestionsWithStatus = (parsed.suggestions || []).map((s: Suggestion) => ({
                ...s,
                status: 'pending' as const
            }));

            setSuggestions(suggestionsWithStatus);
        } catch (err: any) {
            console.error('[RecommendationEngine] Error:', err);
            setError(err.message || 'Failed to generate optimizations');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = (index: number) => {
        setSuggestions(prev => prev.map((s, i) =>
            i === index ? { ...s, status: 'approved' as const } : s
        ));
    };

    const handleReject = (index: number) => {
        setSuggestions(prev => prev.map((s, i) =>
            i === index ? { ...s, status: 'rejected' as const } : s
        ));
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEditText(suggestions[index].optimized);
    };

    const handleSaveEdit = (index: number) => {
        setSuggestions(prev => prev.map((s, i) =>
            i === index ? { ...s, status: 'edited' as const, editedText: editText } : s
        ));
        setEditingIndex(null);
        setEditText("");
    };

    const handleApproveAll = () => {
        setSuggestions(prev => prev.map(s =>
            s.status === 'pending' ? { ...s, status: 'approved' as const } : s
        ));
    };

    const handleFinalize = () => {
        const approved = suggestions.filter(s =>
            s.status === 'approved' || s.status === 'edited'
        );
        setOptimizedBullets(approved);
        setWizardStep('export');
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Spinner className="h-12 w-12 text-primary" />
                <p className="text-muted-foreground">Generating optimized bullets...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                Error: {error}
            </div>
        );
    }

    if (suggestions.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No optimization suggestions generated. Your resume may already be well-optimized!
            </div>
        );
    }

    const approvedCount = suggestions.filter(s => s.status === 'approved' || s.status === 'edited').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold">Resume Optimization Suggestions</h3>
                    <p className="text-sm text-muted-foreground">
                        {approvedCount} of {suggestions.length} approved
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleApproveAll}>
                        Approve All
                    </Button>
                    <Button
                        onClick={handleFinalize}
                        disabled={approvedCount === 0}
                    >
                        Continue to Export ({approvedCount})
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                    <div
                        key={index}
                        className={`border rounded-lg p-4 space-y-3 transition-colors ${
                            suggestion.status === 'approved' ? 'border-green-500 bg-green-500/5' :
                            suggestion.status === 'rejected' ? 'border-red-500 bg-red-500/5' :
                            suggestion.status === 'edited' ? 'border-blue-500 bg-blue-500/5' :
                            'border-border'
                        }`}
                    >
                        <div className="text-xs font-medium text-muted-foreground">
                            {suggestion.section}
                        </div>

                        {/* Original Text */}
                        <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground">Original:</div>
                            <div className="text-sm bg-red-500/10 border border-red-500/20 rounded p-2 line-through text-red-700 dark:text-red-400">
                                {suggestion.original}
                            </div>
                        </div>

                        {/* Optimized Text */}
                        <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground">Optimized:</div>
                            {editingIndex === index ? (
                                <textarea
                                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                            ) : (
                                <div
                                    className="text-sm bg-green-500/10 border border-green-500/20 rounded p-2"
                                    dangerouslySetInnerHTML={{
                                        __html: (suggestion.editedText || suggestion.optimized)
                                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-600 dark:text-green-400">$1</strong>')
                                    }}
                                />
                            )}
                        </div>

                        {/* Explanation with Keywords */}
                        <div className="flex items-start gap-2 text-xs bg-muted/50 rounded p-2">
                            <div className="text-muted-foreground">
                                <strong>Why:</strong> {suggestion.explanation}
                            </div>
                        </div>

                        <div className="flex gap-2 text-xs">
                            <div className="text-muted-foreground">Keywords added:</div>
                            {suggestion.keywords.map((kw, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 bg-primary/10 text-primary rounded"
                                    title={`"${kw}" appears multiple times in job description`}
                                >
                                    {kw}
                                </span>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                            {editingIndex === index ? (
                                <>
                                    <Button size="sm" onClick={() => handleSaveEdit(index)}>
                                        Save Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingIndex(null)}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {suggestion.status === 'pending' && (
                                        <>
                                            <Button size="sm" onClick={() => handleApprove(index)}>
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(index)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleReject(index)}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {suggestion.status === 'approved' && (
                                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                            ✓ Approved
                                        </div>
                                    )}
                                    {suggestion.status === 'rejected' && (
                                        <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                                            ✗ Rejected
                                        </div>
                                    )}
                                    {suggestion.status === 'edited' && (
                                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                            ✓ Edited & Approved
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
