/** [preload ratio, ratio, delay ratio]. */
export type MultiRatio = [number, number, number];

export interface RangePreloadData {
  readonly preloadSecs: number;
  readonly durationSecs: number;
  readonly delaySecs: number;
}

export interface RangedBlockProps<T> {
  /** Render data. */
  readonly data: T;

  /** Preload data. */
  readonly preloaded: RangePreloadData;

  /** Custom class name. */
  readonly className?: string;

  /** [preload ratio, ratio, delay ratio]. If ratio < 0 or > 1,
   * it means the current playback time is outside the time segment. */
  readonly ratios: MultiRatio;
}
