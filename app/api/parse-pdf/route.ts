import { NextResponse } from 'next/server';
import { z } from 'zod';
import { extractResumeData } from '@/lib/extractResume';

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing PDF file.' }, { status: 400 });
    }

    z.number().max(MAX_FILE_SIZE).parse(file.size);

    if (!file.type.includes('pdf')) {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await extractResumeData(buffer);

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to parse PDF right now.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
