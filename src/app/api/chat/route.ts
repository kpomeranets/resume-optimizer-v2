import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
});

// New AI SDK syntax might differ, sticking to compatible streaming response
export async function POST(req: Request) {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
        return new Response("I am a mock AI. To use real AI, set OPENAI_API_KEY in .env.local", { status: 200 });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful career coach assisting a user to rewrite their resume bullet points.
          The user is answering clarifying questions about missing skills.
          Your goal is to suggest a STAR-method bullet point based on their answer.
          Keep it under 2 lines.
          `
                },
                ...messages
            ],
            stream: true,
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    } catch (error) {
        return new Response('Error in Chat API', { status: 500 });
    }
}
