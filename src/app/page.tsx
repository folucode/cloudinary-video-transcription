import { UploadApiResponse } from 'cloudinary';
import styles from './page.module.css';
import cloudinary from '@/lib/cloudinary';
import { TranscriptData } from '@/types/transcript-data.type';

let videoUrl: string = '';
let transcriptionFileUrl: string = '';
let format: string = '';

let transcript: string = '';

const getVideoTranscription = async (file: string): Promise<string> => {
  const res: Response = await fetch(file);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  let transcript: string = '';

  const lines: TranscriptData[] = await res.json();

  lines.forEach(
    (line: TranscriptData) => (transcript = transcript + ` ${line.transcript}`)
  );

  return transcript;
};

async function uploadVideo(formData: FormData) {
  'use server';

  const file = formData.get('video_file') as File;

  const buffer: Buffer = Buffer.from(await file.arrayBuffer());

  const cloud_name: string | undefined = process.env.CLOUDINARY_CLOUD_NAME;

  try {
    const base64Image: string = `data:${file.type};base64,${buffer.toString(
      'base64'
    )}`;

    const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(
      base64Image,
      {
        resource_type: 'video',
        public_id: `videos/${Date.now()}`,
        raw_convert: 'google_speech:srt:vtt',
      }
    );

    videoUrl = `https://res.cloudinary.com/${cloud_name}/video/upload/v${uploadResult.version}/${uploadResult.public_id}.${uploadResult.format}`;

    transcriptionFileUrl = `https://res.cloudinary.com/${cloud_name}/raw/upload/v${uploadResult.version}/${uploadResult.public_id}.transcript`;

    transcript = await getVideoTranscription(transcriptionFileUrl);
  } catch (error: any) {
    console.error(error);
  }
}

export default async function Home() {
  return (
    <main className={styles.main}>
      <form action={uploadVideo}>
        <label htmlFor='video_file'>Video file:</label>
        <input type='file' name='video_file' accept='video/*' required />
        <button type='submit'>Upload</button>
      </form>
      <div className={styles['video-transcription-section']}>
        <video crossOrigin='anonymous' controls muted poster=''>
          <source id='mp4' src={videoUrl} type={`video/${format}`} />
        </video>
        <div className={styles.transcription}>
          <p>{transcript}</p>
        </div>
      </div>
    </main>
  );
}
