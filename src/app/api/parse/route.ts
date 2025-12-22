import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = '';

        if (file.type === 'application/pdf') {
            // PDF files should be parsed in the browser
            return NextResponse.json(
                { error: 'PDF files are parsed in the browser. This should not reach the server.' },
                { status: 400 }
            );
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            try {
                const result = await mammoth.extractRawText({ buffer });
                text = result.value;
            } catch (docxError) {
                console.error('DOCX parsing error:', docxError);
                return NextResponse.json(
                    { error: 'Failed to parse DOCX file. The file may be corrupted or in an unsupported format.' },
                    { status: 500 }
                );
            }
        } else if (file.type === 'text/plain') {
            try {
                text = buffer.toString('utf-8');
            } catch (txtError) {
                console.error('TXT parsing error:', txtError);
                return NextResponse.json(
                    { error: 'Failed to read text file. The file may use an unsupported encoding.' },
                    { status: 500 }
                );
            }
        } else {
            return NextResponse.json(
                { error: `Unsupported file type: ${file.type}. Please use PDF, DOCX, or TXT files.` },
                { status: 400 }
            );
        }

        // Validate text length
        if (!text || text.length < 10) {
            return NextResponse.json(
                { error: 'Extracted text is too short. Please ensure the file contains readable text.' },
                { status: 400 }
            );
        }

        return NextResponse.json({ text });
    } catch (error) {
        console.error('Error parsing file:', error);
        return NextResponse.json(
            { error: 'Failed to parse file. Please try again or paste the text manually.' },
            { status: 500 }
        );
    }
}
