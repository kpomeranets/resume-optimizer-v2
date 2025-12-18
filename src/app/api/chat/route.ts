import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';

const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'mock-key',
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
        return new Response("I am a mock AI. To use real AI, set ANTHROPIC_API_KEY in .env.local", { status: 200 });
    }

    try {
        const result = await streamText({
            model: anthropic('claude-sonnet-4-20250514'),
            messages,
            system: `You are a career coach helping verify a candidate's experience with missing resume keywords.

Your role:
1. Ask up to 3 targeted, contextual questions about missing keywords from the job description
2. Ask intelligent questions that connect to their existing experience (e.g., "I see you have Docker experience. Have you used Kubernetes with it?")
3. Focus on the most important/frequent keywords first
4. Keep questions conversational and specific to their background
5. After getting answers, acknowledge their responses and ask the next question

Keep responses brief and focused on verification, not bullet point generation (that comes later).`,
        });

        return result.toTextStreamResponse();
    } catch {
        return new Response('Error in Chat API', { status: 500 });
    }
}
