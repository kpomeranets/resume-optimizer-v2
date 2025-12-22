import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

interface ExportRequest {
    resumeText: string;
    optimizedBullets: Array<{
        original: string;
        optimized: string;
        editedText?: string;
        section: string;
    }>;
    jobTitle?: string;
    companyName?: string;
}

export async function POST(req: NextRequest) {
    try {
        console.log('[Export] Starting resume export');
        const body: ExportRequest = await req.json();
        const { resumeText, optimizedBullets, jobTitle, companyName } = body;

        // Parse the original resume to extract sections
        const lines = resumeText.split('\n').filter(line => line.trim());

        // Create a map of original bullets to optimized ones
        const optimizationMap = new Map();
        optimizedBullets.forEach(bullet => {
            optimizationMap.set(bullet.original.trim(), bullet.editedText || bullet.optimized);
        });

        // Build the document structure
        const paragraphs: Paragraph[] = [];

        // Add each line, replacing bullets where optimizations exist
        for (const line of lines) {
            const trimmedLine = line.trim();

            // Check if this line matches an optimized bullet
            let finalText = trimmedLine;
            let isOptimized = false;

            for (const [original, optimized] of optimizationMap.entries()) {
                if (trimmedLine.includes(original) || original.includes(trimmedLine)) {
                    // Remove markdown bold syntax (**keyword**)
                    finalText = optimized.replace(/\*\*(.*?)\*\*/g, '$1');
                    isOptimized = true;
                    break;
                }
            }

            // Detect section headers (ALL CAPS or short lines)
            const isHeader = trimmedLine === trimmedLine.toUpperCase() &&
                            trimmedLine.length < 50 &&
                            !trimmedLine.startsWith('-') &&
                            !trimmedLine.startsWith('•');

            // Detect name (first non-empty line, typically)
            const isName = paragraphs.length === 0 && trimmedLine.length < 100;

            // Detect bullet points
            const isBullet = trimmedLine.startsWith('-') ||
                           trimmedLine.startsWith('•') ||
                           trimmedLine.match(/^[\u2022\u2023\u25E6\u2043\u2219]/);

            if (isName) {
                // Name - largest, bold
                paragraphs.push(
                    new Paragraph({
                        text: finalText,
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 }
                    })
                );
            } else if (isHeader) {
                // Section header - bold, slightly larger
                paragraphs.push(
                    new Paragraph({
                        text: finalText,
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 300, after: 100 }
                    })
                );
            } else if (isBullet) {
                // Bullet point - remove bullet character and add proper bullet
                const bulletText = finalText.replace(/^[-•\u2022\u2023\u25E6\u2043\u2219]\s*/, '');
                paragraphs.push(
                    new Paragraph({
                        text: bulletText,
                        bullet: { level: 0 },
                        spacing: { after: 100 }
                    })
                );
            } else {
                // Regular text
                paragraphs.push(
                    new Paragraph({
                        text: finalText,
                        spacing: { after: 100 }
                    })
                );
            }
        }

        // Create the document with ATS-friendly formatting
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 720,    // 0.5 inch
                            right: 720,
                            bottom: 720,
                            left: 720
                        }
                    }
                },
                children: paragraphs
            }]
        });

        // Generate the DOCX file
        const buffer = await Packer.toBuffer(doc);

        // Generate filename
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const role = jobTitle?.replace(/[^a-zA-Z0-9]/g, '_') || 'Resume';
        const company = companyName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Optimized';
        const filename = `${role}_${company}_${date}.docx`;

        console.log('[Export] Document generated:', filename);

        // Return the file
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': buffer.length.toString()
            }
        });
    } catch (error: any) {
        console.error('[Export] Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate document', details: error?.message },
            { status: 500 }
        );
    }
}
