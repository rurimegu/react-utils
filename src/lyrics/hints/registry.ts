import { LyricsBlockRenderData } from '@rurino/core';
import { Registry } from '../../utils/registry';
import {
  BlockPreloader,
  DEFAULT_BLOCK_PRELOADER,
  ForwardedRefComponent,
  RangedBlockProps,
} from '../../utils/types';

export interface LyricsHintProps
  extends RangedBlockProps<LyricsBlockRenderData> {
  /** Custom renderer. */
  readonly renderer?: (
    data: LyricsBlockRenderData,
    children: React.ReactNode,
    isHovered: boolean,
  ) => React.ReactNode;

  /** Callback when the block is clicked. */
  readonly onClick?: (data: LyricsBlockRenderData) => void;
}

export type LyricsHintComponentType = ForwardedRefComponent<LyricsHintProps>;

export interface LyricsHintEntry {
  component: LyricsHintComponentType;
  preloader: BlockPreloader;
}

export const lyricsHintRegistry = new Registry<LyricsHintEntry>('LyricsHint');

export function registerLyricsHint(
  key: string,
  component: LyricsHintComponentType,
  preloader: BlockPreloader = DEFAULT_BLOCK_PRELOADER,
): void {
  lyricsHintRegistry.register(key, {
    component,
    preloader,
  });
}
