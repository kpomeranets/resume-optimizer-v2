import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';

const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'mock-key',
});

interface OptimizeRequest {
    resumeText: string;
    jobDescription: string;
    analysisResult: {
        criticalMissing: string[];
        underweighted: string[];
        optimized: string[];
        suggestions: Record<string, string>;
    };
    userAnswers?: Array<{ question: string; answer: string }>;
}

export async function POST(req: Request) {
    const body: OptimizeRequest = await req.json();
    const { resumeText, jobDescription, analysisResult, userAnswers } = body;

    if (!process.env.ANTHROPIC_API_KEY) {
        return new Response("I am a mock AI. To use real AI, set ANTHROPIC_API_KEY in .env.local", { status: 200 });
    }

    // Build context from user answers
    const userContext = userAnswers?.length
        ? `\n\nUser clarifications:\n${userAnswers.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')}`
        : '';

    const prompt = `You are an expert resume optimization AI. Your task is to rewrite resume bullets to better match the job description while maintaining authenticity.

**Job Description:**
${jobDescription}

**Original Resume:**
${resumeText}

**Analysis Results:**
- Critical Missing Keywords: ${analysisResult.criticalMissing.join(', ')}
- Underweighted Keywords: ${analysisResult.underweighted.join(', ')}
- Optimized Keywords: ${analysisResult.optimized.join(', ')}
${userContext}

**Instructions:**
1. Extract the experience section bullets from the resume
2. For each bullet, determine if it can be improved by:
   - Adding critical missing keywords (only if contextually relevant)
   - Strengthening underweighted keywords
   - Using STAR method (Situation, Task, Action, Result)
   - Keeping it to max 2 lines
3. Return ONLY bullets that need changes (not already optimized ones)
4. For each suggestion, explain which keyword was added and why

**Output Format (JSON only, no markdown):**
{
  "suggestions": [
    {
      "original": "the original bullet text",
      "optimized": "the improved bullet text with **bolded keywords**",
      "explanation": "Added 'Kubernetes' because it appears 5x in job description and connects to existing Docker experience",
      "keywords": ["Kubernetes", "Cloud"],
      "section": "Experience at Company Name"
    }
  ]
}

Return valid JSON only.`;

    try {
        const result = await streamText({
            model: anthropic('claude-sonnet-4-20250514'),
            prompt,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('[Optimize API] Error:', error);
        return new Response('Error generating optimizations', { status: 500 });
    }
}
