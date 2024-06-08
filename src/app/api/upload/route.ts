import { UploadApiResponse } from 'cloudinary';
import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: NextResponse) {
  try {
    const formData = await req.formData();
    const file = formData.get('video_file') as File;

    const buffer: Buffer = Buffer.from(await file.arrayBuffer());
    const cloud_name: string | undefined = process.env.CLOUDINARY_CLOUD_NAME;

    const base64Image: string = `data:${file.type};base64,${buffer.toString(
      'base64'
    )}`;

    const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(
      base64Image,
      {
        resource_type: 'video',
        public_id: `videos/${Date.now()}`,
        raw_convert: 'google_speech',
      }
    );

    const videoUrl = uploadResult.secure_url;
    const transcriptionFileUrl = `https://res.cloudinary.com/${cloud_name}/raw/upload/v${
      uploadResult.version + 1
    }/${uploadResult.public_id}.transcript`;

    return NextResponse.json(
      { videoUrl, transcriptionFileUrl },
      { status: 200 }
    );
  } catch (error: any) {
    throw new Error(error);
  }
}
