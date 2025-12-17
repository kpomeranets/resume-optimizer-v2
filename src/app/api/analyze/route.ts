import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
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

    if (!process.env.OPENAI_API_KEY) {
        // Return mock data if no key (safe failover for dev)
        return new Response(JSON.stringify(mockAnalysis), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert ATS resume analyzer. Analyze the gap between the RESUME and JOB DESCRIPTION.
          Output JSON format:
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
          `
                },
                {
                    role: 'user',
                    content: `RESUME:\n${resumeText.substring(0, 3000)}\n\nJOB DESCRIPTION:\n${jobDescription.substring(0, 3000)}`
                }
            ],
            response_format: { type: 'json_object' }
        });

        const result = completion.choices[0].message.content;
        return new Response(result, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('AI Error:', error);
        return new Response(JSON.stringify({ error: 'AI Analysis Failed' }), { status: 500 });
    }
}
