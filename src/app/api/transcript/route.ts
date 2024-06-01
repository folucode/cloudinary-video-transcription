import { parseTranscriptData } from '@/lib/transcript';
import { TranscriptData } from '@/types/transcript-data.type';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const url: string | null = searchParams.get('url');

  try {
    const response = await fetch(url as string);

    if (response.ok) {
      const transcriptData: TranscriptData[] = await response.json();

      const transcript: string = await parseTranscriptData(transcriptData);

      return NextResponse.json(
        { available: true, transcript },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ available: false }, { status: 200 });
    }
  } catch (error: any) {
    throw new Error(error);
  }
}
