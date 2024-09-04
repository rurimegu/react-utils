import {
  AnnotationRenderData,
  LyricsBlockRenderData,
  RenderDataBase,
} from '@rurino/core';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Registry } from '../../utils/registry';
import { RangedBlockProps, RangePreloadData } from '../../utils/types';

export interface LyricsBlockProps
  extends RangedBlockProps<LyricsBlockRenderData | AnnotationRenderData> {
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

export type LyricsBlockComponentType = ForwardRefExoticComponent<
  LyricsBlockProps & RefAttributes<any>
>;

export type LyricsBlockPreloader = (data: RenderDataBase) => RangePreloadData;

const defaultPreloader: LyricsBlockPreloader = (data) => ({
  preloadSecs: 0,
  durationSecs: data.end - data.start,
  delaySecs: 0,
});

export interface LyricsBlockEntry {
  component: LyricsBlockComponentType;
  preloader: LyricsBlockPreloader;
}

export const lyricsBlockRegistry = new Registry<LyricsBlockEntry>(
  'LyricsBlock',
);

export function registerLyricsBlock(
  key: string,
  component: LyricsBlockComponentType,
  preloader: LyricsBlockPreloader = defaultPreloader,
): void {
  lyricsBlockRegistry.register(key, {
    component,
    preloader,
  });
}
