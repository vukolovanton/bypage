import { listen } from '@tauri-apps/api/event';
import { useState } from 'react';
import { Progress } from "@/components/ui/progress"
import { TypographyH3 } from './TypographyH3';

type TranslateProgress = {
  total: number;
  current: number;
}

export default function TranslationProgress() {
  const [currentChunk, setCurrentChunk] = useState<number | undefined>();
  const [totalChunks, setTotalChunks] = useState<number | undefined>();

  listen<TranslateProgress>('translate_progress', (event) => {
    setCurrentChunk(event.payload.current);
    setTotalChunks(event.payload.total);
    console.log(
      `translate ${event.payload.current} from ${event.payload.total}`
    );
  });

  if (!currentChunk && !totalChunks) {
    return null;
  }

  return (
    <div className='w-full h-full flex flex-col justify-center'>
      <TypographyH3>Working on a book translation. It might take a while...</TypographyH3>
      {(currentChunk !== undefined && totalChunks !== undefined) && <> <p>{currentChunk} of {totalChunks}</p>
        <Progress value={(currentChunk / totalChunks) * 100} /> </>}
    </div>
  )
}
