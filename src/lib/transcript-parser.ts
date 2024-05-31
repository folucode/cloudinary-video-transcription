'use server';

import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

export async function parseTranscript(filePath: string) {
  const transcriptContent: string = await fs.readFile(filePath, 'utf8');
  const response = await axios.get(filePath);

  console.log('parseTranscript: ', { response, transcriptContent });

  //   const lines = transcriptContent.split('\n');
  const transcript = [];

  let tempEntry = {};

  //   lines.forEach((line) => {
  //     if (line.includes('-->')) {
  //       const [start, end] = line.split(' --> ');
  //       tempEntry = { start, end, text: '' };
  //     } else if (line.trim()) {
  //       tempEntry.text =
  //         (tempEntry.text ? tempEntry.text + ' ' : '') + line.trim();
  //     } else if (tempEntry.text) {
  //       transcript.push(tempEntry);
  //       tempEntry = {};
  //     }
  //   });

  //   if (tempEntry.text) {
  //     transcript.push(tempEntry);
  //   }

  return 'transcript';
}
