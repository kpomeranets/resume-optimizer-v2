"use client";

import { useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export function FileUpload() {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setResumeText = useAppStore((state) => state.setResumeText);

    const handleFile = useCallback(async (file: File) => {
        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/parse", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                // Show detailed error from the API
                const errorMessage = data.details || data.error || "Failed to parse file";
                const fullError = `${errorMessage}${data.errorType ? ` (${data.errorType})` : ''}`;
                console.error('[FileUpload] Parse error:', { status: res.status, data });
                throw new Error(fullError);
            }

            console.log('[FileUpload] File parsed successfully, text length:', data.text?.length);
            setResumeText(data.text);
        } catch (err: any) {
            console.error('[FileUpload] Error details:', {
                message: err?.message,
                name: err?.name,
                stack: err?.stack
            });
            setError(`Could not read file: ${err?.message || 'Unknown error'}. Please paste text manually below.`);
        } finally {
            setIsUploading(false);
        }
    }, [setResumeText]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    return (
        <div className="w-full space-y-4">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                    isDragOver ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50",
                    "flex flex-col items-center justify-center gap-2"
                )}
            >
                {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Spinner className="h-8 w-8 text-primary" />
                        <p className="text-sm text-muted-foreground">Parsing resume...</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 bg-muted rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium">Drop your resume here (PDF, DOCX, TXT)</p>
                            <p className="text-xs text-muted-foreground">or click to browse</p>
                        </div>
                        <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        />
                    </>
                )}
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                    {error}
                </div>
            )}

            {/* Fallback Paste Area */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Or paste resume text</label>
                <textarea
                    className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Paste your resume content here..."
                    onChange={(e) => setResumeText(e.target.value)}
                />
            </div>
        </div>
    );
}
