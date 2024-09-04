import { MultiRatio, RangePreloadData } from './types';

/**
 * Lerp between two time points. Returns -1 or 2 if time is outside the range, 0-1 otherwise.
 * @param start Start time.
 * @param end End time.
 * @param time Current time.
 * @returns Lerp ratio, -1 if time < start, 2 if time > end, 0-1 otherwise.
 */
export function lerpBlockTime(
  start: number,
  end: number,
  time: number,
): number {
  if (time < start) return -1;
  if (time > end) return 2;
  return (time - start) / (end - start);
}

export function calcRatios(
  start: number,
  end: number,
  time: number,
  preload: RangePreloadData,
): MultiRatio {
  return [
    lerpBlockTime(start - preload.preloadSecs, start, time),
    lerpBlockTime(start, end, time),
    lerpBlockTime(end, end + preload.delaySecs, time),
  ];
}
