import { NextRequest, NextResponse } from 'next/server';
// @ts-expect-error - pdf-parse missing default export type definition
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require('pdf-parse');
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
            const data = await pdf(buffer);
            text = data.text;
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else if (file.type === 'text/plain') {
            text = buffer.toString('utf-8');
        } else {
            return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
        }

        return NextResponse.json({ text });
    } catch (error) {
        console.error('Error parsing file:', error);
        return NextResponse.json(
            { error: 'Failed to parse file' },
            { status: 500 }
        );
    }
}
