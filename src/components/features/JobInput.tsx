"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

export function JobInput() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setJobDescription = useAppStore((state) => state.setJobDescription);

    const fetchJob = async () => {
        if (!url) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/fetch-job", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.isBlocked) {
                    throw new Error("This site blocks automated access. Please paste the description manually.");
                }
                throw new Error(data.error || "Failed to fetch job");
            }

            setJobDescription(data.text);
        } catch (err: unknown) {
            let msg = "Error fetching job";
            if (err instanceof Error) msg = err.message;
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Paste Job URL (e.g. LinkedIn, Indeed)..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <Button onClick={fetchJob} disabled={loading || !url}>
                    {loading ? <Spinner className="mr-2" /> : null}
                    Fetch
                </Button>
            </div>

            {error && (
                <div className="p-3 text-sm text-yellow-500 bg-yellow-500/10 rounded-md border border-yellow-500/20">
                    ⚠️ {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium">Job Description Text</label>

                {/* Fix reactivity */}
                <ReactiveTextArea />
            </div>
        </div>
    );
}

function ReactiveTextArea() {
    const jobDescription = useAppStore((state) => state.jobDescription);
    const setJobDescription = useAppStore((state) => state.setJobDescription);

    return (
        <textarea
            className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
        />
    )
}
