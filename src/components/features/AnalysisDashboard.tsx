"use client";

import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function AnalysisDashboard() {
    const result = useAppStore((state) => state.analysisResult);

    if (!result) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Analysis Report</h2>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Critical Missing */}
                <div className="p-4 rounded-lg border border-red-900/50 bg-red-950/20">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <h3 className="font-semibold text-red-200">Critical Missing</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {result.criticalMissing.map((kw) => (
                            <span key={kw} className="px-2 py-1 text-xs rounded-full bg-red-500/10 text-red-200 border border-red-500/20">
                                {kw}
                            </span>
                        ))}
                        {result.criticalMissing.length === 0 && <span className="text-sm text-muted-foreground">None found!</span>}
                    </div>
                </div>

                {/* Underweighted */}
                <div className="p-4 rounded-lg border border-yellow-900/50 bg-yellow-950/20">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        <h3 className="font-semibold text-yellow-200">Underweighted</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {result.underweighted.map((kw) => (
                            <span key={kw} className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-200 border border-yellow-500/20">
                                {kw}
                            </span>
                        ))}
                        {result.underweighted.length === 0 && <span className="text-sm text-muted-foreground">None found!</span>}
                    </div>
                </div>

                {/* Optimized */}
                <div className="p-4 rounded-lg border border-green-900/50 bg-green-950/20">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <h3 className="font-semibold text-green-200">Optimized</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {result.optimized.map((kw) => (
                            <span key={kw} className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-200 border border-green-500/20">
                                {kw}
                            </span>
                        ))}
                        {result.optimized.length === 0 && <span className="text-sm text-muted-foreground">No matches yet.</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
