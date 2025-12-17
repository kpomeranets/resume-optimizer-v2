import { NextRequest, NextResponse } from 'next/server';
// import { JSDOM } from 'jsdom'; // Note: I need to install jsdom or use a simpler regex approach if avoiding heavy deps.
// Implementation plan didn't specify jsdom. I'll use a simple fetch + text extraction or rely on 'cheerio' if I installed it.
// I didn't install 'cheerio' or 'jsdom'. I'll try to use standard regex / string parsing for simplicity or just fetch text.
// Actually, I can just fetch the HTML and try to strip tags. It's fragile but basic.
// The prompt said "Server-Side Proxy".
// Edge case: 403/401 handling is required.

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            if (response.status === 403 || response.status === 401) {
                return NextResponse.json(
                    { error: 'Access Denied', isBlocked: true },
                    { status: 403 }
                );
            }
            return NextResponse.json(
                { error: 'Failed to fetch URL' },
                { status: response.status }
            );
        }

        const html = await response.text();

        // basic text extraction
        const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

        return NextResponse.json({ text });
    } catch (error) {
        console.error('Error fetching job:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
