import { AnnotationRenderData, LyricsBlockRenderData } from '@rurino/core';
import { Registry } from '../../utils/registry';
import {
  BlockPreloader,
  DEFAULT_BLOCK_PRELOADER,
  ForwardedRefComponent,
  RangedBlockProps,
  ZOD_EMPTY_OBJ,
} from '../../utils/types';
import { z } from 'zod';

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

  /** Custom options. */
  readonly options?: any;
}

export type LyricsBlockComponentType = ForwardedRefComponent<LyricsBlockProps>;

export interface LyricsBlockEntry {
  component: LyricsBlockComponentType;
  preloader: BlockPreloader;
  optionsType: z.ZodType;
}

export const lyricsBlockRegistry = new Registry<LyricsBlockEntry>(
  'LyricsBlock',
);

export function registerLyricsBlock(
  key: string,
  component: LyricsBlockComponentType,
  optionsType: z.ZodType = ZOD_EMPTY_OBJ,
  preloader: BlockPreloader = DEFAULT_BLOCK_PRELOADER,
): void {
  lyricsBlockRegistry.register(key, {
    component,
    preloader,
    optionsType,
  });
}
