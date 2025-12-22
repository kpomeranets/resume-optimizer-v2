"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";

export function ExportPreview() {
    const resumeText = useAppStore((state) => state.resumeText);
    const optimizedBullets = useAppStore((state) => state.optimizedBullets);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [jobTitle, setJobTitle] = useState("");
    const [companyName, setCompanyName] = useState("");

    const handleExport = async () => {
        setIsExporting(true);
        setError(null);

        try {
            const res = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeText,
                    optimizedBullets,
                    jobTitle: jobTitle.trim() || undefined,
                    companyName: companyName.trim() || undefined
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Export failed');
            }

            // Download the file
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Get filename from Content-Disposition header or use default
            const contentDisposition = res.headers.get('Content-Disposition');
            const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
            const filename = filenameMatch?.[1] || 'Resume_Optimized.docx';

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            console.log('[ExportPreview] File downloaded:', filename);
        } catch (err: any) {
            console.error('[ExportPreview] Export error:', err);
            setError(err.message || 'Failed to export resume');
        } finally {
            setIsExporting(false);
        }
    };

    // Create a preview by applying optimizations to the original text
    const createPreview = () => {
        let previewText = resumeText;

        optimizedBullets.forEach(bullet => {
            // Remove markdown bold syntax for preview
            const cleanOptimized = (bullet.editedText || bullet.optimized)
                .replace(/\*\*(.*?)\*\*/g, '$1');

            // Replace original with optimized (simple approach)
            previewText = previewText.replace(bullet.original, cleanOptimized);
        });

        return previewText;
    };

    const previewText = createPreview();
    const changesCount = optimizedBullets.length;

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Your Optimized Resume</h2>
                <p className="text-muted-foreground">
                    {changesCount} {changesCount === 1 ? 'improvement' : 'improvements'} applied
                </p>
            </div>

            {/* File naming inputs */}
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title (optional)</label>
                    <Input
                        placeholder="e.g., Senior Software Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name (optional)</label>
                    <Input
                        placeholder="e.g., Acme Corp"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
                File will be named: {jobTitle || 'Resume'}_{companyName || 'Optimized'}_{new Date().toISOString().split('T')[0]}.docx
            </div>

            {/* Preview */}
            <div className="border rounded-lg p-6 bg-white text-black max-h-[500px] overflow-y-auto">
                <div className="whitespace-pre-wrap font-sans text-sm">
                    {previewText}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20 text-center">
                    {error}
                </div>
            )}

            {/* Export buttons */}
            <div className="flex justify-center gap-4">
                <Button
                    size="lg"
                    onClick={handleExport}
                    disabled={isExporting}
                    className="min-w-[200px]"
                >
                    {isExporting ? (
                        <>
                            <Spinner className="mr-2 h-5 w-5" /> Generating...
                        </>
                    ) : (
                        'Download .DOCX'
                    )}
                </Button>
            </div>

            {/* Info box */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <h3 className="font-semibold">ATS-Friendly Format</h3>
                <ul className="space-y-1 text-muted-foreground">
                    <li>• Standard Arial font for compatibility</li>
                    <li>• Simple formatting without tables or columns</li>
                    <li>• Optimized keywords from job description</li>
                    <li>• Professional structure with clear sections</li>
                </ul>
            </div>

            {/* Summary of changes */}
            {optimizedBullets.length > 0 && (
                <div className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold">Summary of Changes</h3>
                    <div className="space-y-2 text-sm">
                        {optimizedBullets.slice(0, 3).map((bullet, idx) => (
                            <div key={idx} className="p-2 bg-green-500/5 border border-green-500/20 rounded">
                                <div className="text-xs text-muted-foreground mb-1">{bullet.section}</div>
                                <div className="text-green-600 dark:text-green-400">
                                    Added keywords: {bullet.keywords.join(', ')}
                                </div>
                            </div>
                        ))}
                        {optimizedBullets.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center">
                                ... and {optimizedBullets.length - 3} more {optimizedBullets.length - 3 === 1 ? 'change' : 'changes'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
