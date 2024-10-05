import { useCallback, useEffect, useState } from 'react';
import { useMove, UseMovePosition } from '../control/use-move';
import { Clamp, Clamp01, FormatTime } from '@rurino/core';

interface DemoPlayerProps {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  duration: number;
}

function DemoPlayer({ time, setTime, duration }: DemoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const onClick = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newValue = Clamp01(x / rect.width) * duration;
      setTime(newValue);
    },
    [setTime, duration],
  );
  const onMove = useCallback(
    (pos: UseMovePosition) => setTime(pos.x * duration),
    [setTime, duration],
  );
  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(() => {
        setTime((t) => {
          const newTime = Clamp(t + 0.01, 0, duration);
          if (newTime === duration) setIsPlaying(false);
          return newTime;
        });
      }, 10);
      return () => clearInterval(id);
    }
  }, [isPlaying, setTime, duration]);
  const { ref } = useMove(onMove);

  return (
    <div className="h-8 my-2 transition-all box-border flex items-center space-x-2">
      <div
        className="size-8 rounded-full bg-violet-100 text-violet-800 cursor-pointer"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {/* play button */}
        <span>
          {isPlaying ? (
            <svg
              className="size-6 m-1 hover:size-8 hover:m-0 transition-all"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg
              className="size-6 m-1 hover:size-8 hover:m-0 transition-all"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
      </div>
      <div className="flex-grow sm:flex-grow-0 h-3 py-0.5 hover:py-0 transition-all box-border">
        <div
          className="rounded-full w-full sm:w-64 h-full bg-gray-200 cursor-pointer"
          onClick={onClick}
          ref={ref}
        >
          <div
            className="rounded-full h-full bg-pink-500"
            style={{ width: `${(time / duration) * 100}%` }}
          />
        </div>
      </div>
      <div className="text-sm text-gray-500 text-nowrap">
        {FormatTime(time, 2)} / {FormatTime(duration, 2)}
      </div>
    </div>
  );
}

export default DemoPlayer;
