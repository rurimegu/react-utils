import { AnnotationRenderData, LyricsBlockRenderData } from '@rurino/core';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Registry } from '../../utils/registry';

export interface LyricsBlockProps<
  T extends LyricsBlockPreloadData = LyricsBlockPreloadData,
> {
  /** Render data. */
  readonly data: LyricsBlockRenderData | AnnotationRenderData;

  /** Preloaded data. */
  readonly preloaded: T;

  /** [preload ratio, ratio, delay ratio]. If ratio < 0 or > 1,
   * it means the current playback time is outside the time segment. */
  readonly ratios: [number, number, number];

  /** Custom renderer. */
  readonly renderer?: (
    data: LyricsBlockRenderData | AnnotationRenderData,
    children: React.ReactNode,
    isHovered: boolean,
  ) => React.ReactNode;

  /** Callback when the block is clicked. */
  readonly onClick?: (
    data: LyricsBlockRenderData | AnnotationRenderData,
  ) => void;
}

export interface LyricsBlockPreloadData {
  readonly preloadSecs: number;
  readonly durationSecs: number;
  readonly delaySecs: number;
}

export type LyricsBlockComponentType<T extends LyricsBlockPreloadData> =
  ForwardRefExoticComponent<LyricsBlockProps<T> & RefAttributes<any>>;

export type LyricsBlockPreloader<
  T extends LyricsBlockPreloadData = LyricsBlockPreloadData,
> = (data: LyricsBlockRenderData | AnnotationRenderData) => T;

const defaultPreloader: LyricsBlockPreloader = (data) => ({
  preloadSecs: 0,
  durationSecs: data.end - data.start,
  delaySecs: 0,
});

export interface LyricsBlockEntry<T extends LyricsBlockPreloadData> {
  component: LyricsBlockComponentType<T>;
  preloader: LyricsBlockPreloader;
}

export const lyricsBlockRegistry = new Registry<LyricsBlockEntry<any>>(
  'LyricsBlock',
);

export function registerLyricsBlock(
  key: string,
  component: LyricsBlockComponentType<LyricsBlockPreloadData>,
): void;

export function registerLyricsBlock<T extends LyricsBlockPreloadData>(
  key: string,
  component: LyricsBlockComponentType<T>,
  preloader: LyricsBlockPreloader<T>,
): void;

export function registerLyricsBlock(
  key: string,
  component: LyricsBlockComponentType<any>,
  preloader: LyricsBlockPreloader<any> = defaultPreloader,
): void {
  lyricsBlockRegistry.register(key, {
    component,
    preloader,
  });
}
