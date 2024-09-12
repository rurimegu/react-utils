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

const RATIO_BEFORE_START: MultiRatio = [-1, -1, -1];
const RATIO_AFTER_END: MultiRatio = [2, 2, 2];

export function calcRatios(
  start: number,
  end: number,
  time: number,
  preload: RangePreloadData,
): MultiRatio {
  if (time < start - preload.preloadSecs) return RATIO_BEFORE_START;
  if (time > end + preload.delaySecs) return RATIO_AFTER_END;
  return [
    lerpBlockTime(start - preload.preloadSecs, start, time),
    lerpBlockTime(start, end, time),
    lerpBlockTime(end, end + preload.delaySecs, time),
  ];
}
