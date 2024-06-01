'use client';

import { useState } from 'react';
import styles from './page.module.css';

const POLLING_INTERVAL = 5000;

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const checkTranscriptionStatus = async (url: string) => {
    try {
      const response = await fetch(
        `/api/transcript?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      if (data.available) {
        setTranscript(data.transcript);
      } else {
        setTimeout(() => checkTranscriptionStatus(url), POLLING_INTERVAL);
      }
    } catch (error: any) {
      console.error('Error checking transcription status:', error);
    }
  };

  const uploadVideo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      const data = await response.json();
      setVideoUrl(data.videoUrl);
      setTranscript('');

      checkTranscriptionStatus(data.transcriptionFileUrl);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className={styles.main}>
      <form onSubmit={uploadVideo}>
        <label htmlFor='video_file'>Video file:</label>
        <input type='file' name='video_file' accept='video/*' required />
        <button type='submit' disabled={isUploading}>
          {isUploading ? 'Uploading video...' : 'Upload'}
        </button>
      </form>
      {videoUrl && (
        <div className={styles['video-transcription-section']}>
          <video crossOrigin='anonymous' controls muted>
            <source src={videoUrl} type='video/mp4' />
          </video>
          <div className={styles.transcription}>
            <p>
              {transcript ? transcript : 'Transcription is being processed...'}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
