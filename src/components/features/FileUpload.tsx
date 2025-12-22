"use client";

import { useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

async function parsePDFClientSide(file: File): Promise<string> {
    console.log('[PDF Parser] Starting PDF parsing for:', file.name);
    console.log('[PDF Parser] File size:', file.size, 'bytes');
    console.log('[PDF Parser] File type:', file.type);

    try {
        // Dynamic import to avoid SSR issues
        console.log('[PDF Parser] Importing pdfjs-dist...');
        const pdfjs = await import('pdfjs-dist');
        console.log('[PDF Parser] pdfjs-dist imported successfully, version:', pdfjs.version);

        // Set up the worker
        const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        console.log('[PDF Parser] Setting worker source:', workerSrc);
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

        // Read file as array buffer
        console.log('[PDF Parser] Reading file as array buffer...');
        const arrayBuffer = await file.arrayBuffer();
        console.log('[PDF Parser] Array buffer size:', arrayBuffer.byteLength, 'bytes');

        // Load PDF document
        console.log('[PDF Parser] Loading PDF document...');
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        console.log('[PDF Parser] PDF loaded successfully, pages:', pdf.numPages);

        let fullText = '';

        // Iterate through all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            console.log(`[PDF Parser] Processing page ${pageNum}/${pdf.numPages}...`);
            const page = await pdf.getPage(pageNum);
            console.log(`[PDF Parser] Page ${pageNum} loaded`);

            const textContent = await page.getTextContent();
            console.log(`[PDF Parser] Page ${pageNum} text content items:`, textContent.items.length);

            // Extract text from page
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');

            console.log(`[PDF Parser] Page ${pageNum} extracted text length:`, pageText.length);
            fullText += pageText + '\n';
        }

        const trimmedText = fullText.trim();
        console.log('[PDF Parser] Total extracted text length:', trimmedText.length);
        console.log('[PDF Parser] First 200 chars:', trimmedText.substring(0, 200));

        return trimmedText;
    } catch (error) {
        console.error('[PDF Parser] ERROR occurred:', error);
        console.error('[PDF Parser] Error name:', error instanceof Error ? error.name : 'Unknown');
        console.error('[PDF Parser] Error message:', error instanceof Error ? error.message : String(error));
        console.error('[PDF Parser] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        throw error;
    }
}

function getFileTypeIcon(fileType: string): string {
    if (fileType === 'application/pdf') return '📄';
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return '📝';
    if (fileType === 'text/plain') return '📃';
    return '📄';
}

export function FileUpload() {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);

    const setResumeText = useAppStore((state) => state.setResumeText);

    const handleFile = useCallback(async (file: File) => {
        console.log('[FileUpload] Starting file upload:', file.name, file.type);

        // Clear previous state
        setIsUploading(true);
        setError(null);
        setUploadedFileName(null);
        setUploadedFileType(null);
        setUploadingFileName(file.name);

        try {
            let text = '';

            // Handle PDF files client-side
            if (file.type === 'application/pdf') {
                console.log('[FileUpload] Detected PDF file, using client-side parsing');
                try {
                    text = await parsePDFClientSide(file);
                    console.log('[FileUpload] PDF parsing successful, text length:', text.length);
                } catch (pdfError) {
                    console.error('[FileUpload] PDF parsing failed:', pdfError);
                    setError("Could not read PDF. The file may be encrypted, image-based, or corrupted. Please paste text manually below.");
                    setIsUploading(false);
                    setUploadingFileName(null);
                    return;
                }
            } else {
                // Handle DOCX and TXT files via server
                console.log('[FileUpload] Sending file to server for parsing:', file.type);
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/parse", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('[FileUpload] Server parsing failed:', errorData);
                    throw new Error(errorData.error || "Failed to parse file");
                }

                const data = await res.json();
                text = data.text;
                console.log('[FileUpload] Server parsing successful, text length:', text.length);
            }

            // Validate text length
            if (!text || text.length < 10) {
                console.error('[FileUpload] Extracted text too short:', text.length);
                setError("Extracted text is too short. Please ensure the file contains readable text or paste it manually below.");
                setIsUploading(false);
                setUploadingFileName(null);
                return;
            }

            console.log('[FileUpload] File upload successful!');
            setResumeText(text);
            setUploadedFileName(file.name);
            setUploadedFileType(file.type);
        } catch (err) {
            console.error('[FileUpload] Error during file processing:', err);
            setError(err instanceof Error ? err.message : "Could not read file. Please paste text manually below.");
        } finally {
            setIsUploading(false);
            setUploadingFileName(null);
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
                        <p className="text-sm text-muted-foreground">
                            Parsing {uploadingFileName || 'resume'}...
                        </p>
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

            {/* Success Message */}
            {uploadedFileName && uploadedFileType && !error && (
                <div className="p-3 text-sm text-green-600 bg-green-500/10 rounded-md border border-green-500/20 flex items-center gap-2">
                    <span className="text-lg">{getFileTypeIcon(uploadedFileType)}</span>
                    <span>✓ Successfully uploaded: <strong>{uploadedFileName}</strong></span>
                </div>
            )}

            {/* Error Message */}
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
