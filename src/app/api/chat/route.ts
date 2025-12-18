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
            system: `You are a helpful career coach assisting a user to rewrite their resume bullet points.
            The user is answering clarifying questions about missing skills.
            Your goal is to suggest a STAR-method bullet point based on their answer.
            Keep it under 2 lines.`,
        });

        return result.toTextStreamResponse();
    } catch {
        return new Response('Error in Chat API', { status: 500 });
    }
}
