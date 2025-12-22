import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(req: NextRequest) {
    try {
        console.log('[PDF Parse] Starting file parse request');
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        console.log('[PDF Parse] File received:', { name: file.name, type: file.type, size: file.size });

        const buffer = Buffer.from(await file.arrayBuffer());
        console.log('[PDF Parse] Buffer created, size:', buffer.length);

        let text = '';

        if (file.type === 'application/pdf') {
            console.log('[PDF Parse] Attempting to parse PDF...');
            try {
                console.log('[PDF Parse] Loading pdf-parse library...');
                // Dynamic import for pdf-parse to work with Next.js 16 Turbopack
                const pdfParse = (await import('pdf-parse')).default;
                const data = await pdfParse(buffer);
                console.log('[PDF Parse] PDF parsed successfully, text length:', data.text.length);
                text = data.text;
            } catch (pdfError: any) {
                console.error('[PDF Parse] PDF Error Details:', {
                    message: pdfError?.message,
                    name: pdfError?.name,
                    stack: pdfError?.stack,
                    fullError: pdfError
                });

                // Return detailed error to the client
                return NextResponse.json({
                    error: 'PDF parsing failed',
                    details: pdfError?.message || 'Unknown PDF error',
                    errorType: pdfError?.name,
                    suggestion: 'The file may be encrypted, image-based, or require additional dependencies. Please paste text manually.'
                }, { status: 500 });
            }
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            console.log('[PDF Parse] Attempting to parse DOCX...');
            const result = await mammoth.extractRawText({ buffer });
            console.log('[PDF Parse] DOCX parsed successfully, text length:', result.value.length);
            text = result.value;
        } else if (file.type === 'text/plain') {
            console.log('[PDF Parse] Parsing plain text file...');
            text = buffer.toString('utf-8');
            console.log('[PDF Parse] Text file parsed, length:', text.length);
        } else {
            console.log('[PDF Parse] Unsupported file type:', file.type);
            return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
        }

        console.log('[PDF Parse] Parse complete, returning text');
        return NextResponse.json({ text });
    } catch (error: any) {
        console.error('[PDF Parse] Top-level error:', {
            message: error?.message,
            name: error?.name,
            stack: error?.stack,
            fullError: error
        });
        return NextResponse.json(
            {
                error: 'Failed to parse file',
                details: error?.message || 'Unknown error',
                errorType: error?.name
            },
            { status: 500 }
        );
    }
}
