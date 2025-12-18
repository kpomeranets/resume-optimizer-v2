import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'mock-key',
});

// Mock response function for development without API key
const mockAnalysis = {
    criticalMissing: ['Python', 'Kubernetes'],
    underweighted: ['Agile', 'Leadership'],
    optimized: ['JavaScript', 'React'],
    suggestions: {
        Python: 'Did you use Python for scripting or automation in your previous role?',
        Kubernetes: 'Have you deployed containerized applications using K8s?',
    },
};

export async function POST(req: Request) {
    const { resumeText, jobDescription } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
        // Return mock data if no key (safe failover for dev)
        return new Response(JSON.stringify(mockAnalysis), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-latest',
            max_tokens: 2000,
            messages: [
                {
                    role: 'user',
                    content: `You are an expert ATS resume analyzer. Analyze the gap between the RESUME and JOB DESCRIPTION.
Output JSON format ONLY (no other text):
{
  "criticalMissing": ["keyword1", "keyword2"],
  "underweighted": ["keyword3"],
  "optimized": ["keyword4"],
  "suggestions": {
     "keyword1": "Clarifying question?",
     "keyword2": "Clarifying question?"
  }
}
- "criticalMissing": Keywords in JD >3 times, 0 in Resume.
- "underweighted": Keywords in JD >3 times, only 1 in Resume.
- "optimized": Good balance.
- "suggestions": For critical missing, ask a question to check if user actually has the skill.

RESUME:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 3000)}`
                }
            ]
        });

        const rawText = message.content[0].type === 'text' ? message.content[0].text : '{}';

        // Extract JSON from potential markdown code blocks
        let jsonText = rawText;
        const jsonMatch = rawText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
            jsonText = jsonMatch[1];
        } else {
            // Try to find JSON object in the text
            const objectMatch = rawText.match(/\{[\s\S]*\}/);
            if (objectMatch) {
                jsonText = objectMatch[0];
            }
        }

        // Parse and validate the JSON
        const parsedResult = JSON.parse(jsonText);

        // Ensure all required fields exist with defaults
        const result = {
            criticalMissing: parsedResult.criticalMissing || [],
            underweighted: parsedResult.underweighted || [],
            optimized: parsedResult.optimized || [],
            suggestions: parsedResult.suggestions || {}
        };

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('AI Error:', error);
        return new Response(JSON.stringify({ error: 'AI Analysis Failed' }), { status: 500 });
    }
}
