import { LyricsBlockRenderData } from '@rurino/core';
import { Registry } from '../../utils/registry';
import {
  BlockPreloader,
  DEFAULT_HINT_PRELOADER,
  ForwardedRefComponent,
  RangedBlockProps,
  ZOD_EMPTY_OBJ,
} from '../../utils/types';
import { z } from 'zod';

export interface LyricsHintProps<T = any>
  extends RangedBlockProps<LyricsBlockRenderData> {
  /** Custom renderer. */
  readonly renderer?: (
    data: LyricsBlockRenderData,
    children: React.ReactNode,
    isHovered: boolean,
  ) => React.ReactNode;

  /** Callback when the block is clicked. */
  readonly onClick?: (data: LyricsBlockRenderData) => void;

  /** Custom options. */
  readonly options: T;
}

export type LyricsHintComponentType = ForwardedRefComponent<LyricsHintProps>;

export interface LyricsHintEntry {
  component: LyricsHintComponentType;
  preloader: BlockPreloader;
  optionsType: z.ZodType;
}

export const lyricsHintRegistry = new Registry<LyricsHintEntry>('LyricsHint');

export function registerLyricsHint(
  key: string,
  component: LyricsHintComponentType,
  optionsType: z.ZodType = ZOD_EMPTY_OBJ,
  preloader: BlockPreloader = DEFAULT_HINT_PRELOADER,
): void {
  lyricsHintRegistry.register(key, {
    component,
    preloader,
    optionsType,
  });
}
