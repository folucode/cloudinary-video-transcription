'use client';

import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import styles from '../page.module.css';

export default function Transcribe() {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();

  const version: string | null = searchParams.get('version');
  const format: string | null = searchParams.get('format');
  const public_id: string | null = searchParams.get('public_id');

  const cloud_name: string | undefined = process.env.NEXT_PUBLIC_CLOUD_NAME;

  if (!cloud_name || !version || !format || !public_id) {
    return <p>Missing required parameters</p>;
  }

  const videoUrl: string = `https://res.cloudinary.com/${cloud_name}/video/upload/v${version}/${public_id}.${format}`;
  const subtitleFile: string = `https://res.cloudinary.com/${cloud_name}/raw/upload/v${version}/${public_id}.vtt`;

  console.log(videoUrl);

  return (
    <main className={styles.main}>
      <video
        crossOrigin='anonymous'
        controls
        muted
        poster='https://res.cloudinary.com/demo/video/upload/so_120/lincoln_speech.jpg'
      >
        <source id='mp4' src={videoUrl} type={`video/${format}`} />
        <track
          label='English'
          kind='subtitles'
          srcLang='en'
          src={subtitleFile}
          default
        />
      </video>
    </main>
  );
}
