import {
  CallBlockRenderData,
  LyricsLineRenderData,
  RenderDataBase,
} from '@rurino/core';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

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

export type BlockPreloader = (data: RenderDataBase) => RangePreloadData;

export const DEFAULT_BLOCK_PRELOADER: BlockPreloader = (data) => {
  let preloadSecs = 0;
  if (data instanceof CallBlockRenderData && !data.prev && data.parent!.hint) {
    preloadSecs = data.parent!.hint;
  }
  if (data instanceof LyricsLineRenderData && data.hint) {
    preloadSecs = data.hint;
  }
  const ret: RangePreloadData = {
    preloadSecs,
    durationSecs: data.end - data.start,
    delaySecs: 0,
  };
  return ret;
};

export type ForwardedRefComponent<T> = ForwardRefExoticComponent<
  T & RefAttributes<any>
>;
