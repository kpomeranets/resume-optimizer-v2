"use client";

import { useChat } from '@ai-sdk/react';
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from 'react';

export function AuthenticityWizard() {
    const result = useAppStore((state) => state.analysisResult);
    const [hasStarted, setHasStarted] = useState(false);

    const chatResponse = useChat({
        api: '/api/chat',
    });

    const { messages, input, handleInputChange, handleSubmit, isLoading, error, setInput } = chatResponse;

    // Fallback if input is undefined
    const inputValue = input ?? '';

    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!result || hasStarted) return;

        setHasStarted(true);
        const missing = result.criticalMissing.join(', ');

        // Set the input and submit
        if (setInput) {
            setInput(`I need help identifying if I have experience with these missing keywords from the job description: ${missing}. Please ask me about the most important one.`);
        }

        // Create a synthetic form event to submit
        const form = e.target as HTMLFormElement;
        setTimeout(() => {
            form.requestSubmit();
        }, 100);
    };

    console.log('Chat state:', { messagesCount: messages.length, isLoading, error, hasStarted });

    return (
        <div className="flex flex-col h-[500px] border rounded-lg bg-background/50 backdrop-blur-sm">
            <div className="p-4 border-b bg-muted/20">
                <h3 className="font-semibold">Authenticity Wizard</h3>
                <p className="text-sm text-muted-foreground">The AI is checking if you have experience with missing skills.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                        Error: {error.message}
                    </div>
                )}

                {messages.length === 0 && !isLoading && !error && !hasStarted && result && (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <p className="text-center text-muted-foreground text-sm">
                            Missing keywords: <span className="text-primary font-medium">{result.criticalMissing.join(', ')}</span>
                        </p>
                        <Button onClick={(e: any) => handleStart(e)}>
                            Start Verification Questions
                        </Button>
                    </div>
                )}

                {messages.length === 0 && (isLoading || hasStarted) && (
                    <div className="text-center text-muted-foreground text-sm py-8">
                        Starting conversation...
                    </div>
                )}

                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {messages.filter((m: any) => m.role !== 'system').map((m: any) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted border border-border'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}

                {isLoading && messages.length > 0 && (
                    <div className="flex justify-start">
                        <div className="bg-muted border border-border rounded-lg p-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-background">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Type your answer..."
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !inputValue.trim()}>Send</Button>
                </form>
            </div>
        </div>
    );
}
