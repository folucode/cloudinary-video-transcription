import { UploadApiResponse } from 'cloudinary';
import styles from './page.module.css';
import cloudinary from '@/lib/cloudinary';
import { redirect } from 'next/navigation';

export default function Home() {
  async function uploadVideo(formData: FormData) {
    'use server';

    const file = formData.get('video_file') as File;

    const buffer: Buffer = Buffer.from(await file.arrayBuffer());

    const public_id: string = `videos/${Date.now()}`;
    let version: number = 0;
    let format: string = '';

    try {
      const base64Image: string = `data:${file.type};base64,${buffer.toString(
        'base64'
      )}`;

      const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(
        base64Image,
        {
          resource_type: 'video',
          public_id,
          raw_convert: 'google_speech:srt:vtt',
        }
      );

      version = uploadResult.version;
      format = uploadResult.format;
    } catch (error: any) {
      console.error(error);
    }

    redirect(
      `transcribe?public_id=${public_id}&format=${format}&version=${version}`
    );
  }

  return (
    <main className={styles.main}>
      <form action={uploadVideo}>
        <label htmlFor='video_file'>Video file:</label>
        <input type='file' name='video_file' accept='video/*' required />
        <button type='submit'>Upload</button>
      </form>
    </main>
  );
}
