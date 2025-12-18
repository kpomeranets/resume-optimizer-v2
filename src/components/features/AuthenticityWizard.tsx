"use client";

import { useChat } from '@ai-sdk/react';
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useEffect } from 'react';

export function AuthenticityWizard() {
    const result = useAppStore((state) => state.analysisResult);
    const chatResponse = useChat({
        api: '/api/chat',
    });

    const { messages, input, handleInputChange, handleSubmit, append, isLoading, error } = chatResponse;

    // Initial prompt
    useEffect(() => {
        if (result && messages.length === 0 && append) {
            const missing = result.criticalMissing.join(', ');
            console.log('Sending initial message with missing keywords:', missing);
            // Send initial message to start the conversation
            append({
                role: 'user',
                content: `I need help identifying if I have experience with these missing keywords from the job description: ${missing}. Please ask me about the most important one.`
            }).catch((err) => {
                console.error('Error appending message:', err);
            });
        }
    }, [result, append, messages.length]);

    console.log('Chat state:', { messagesCount: messages.length, isLoading, error, hasAppend: !!append });

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

                {messages.length === 0 && !isLoading && !error && (
                    <div className="text-center text-muted-foreground text-sm py-8">
                        Initializing conversation...
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

                {isLoading && (
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
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your answer..."
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>Send</Button>
                </form>
            </div>
        </div>
    );
}
