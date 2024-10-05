import { CallBlockRenderData } from '@rurino/core';
import { Registry } from '../../utils/registry';
import {
  BlockPreloader,
  DEFAULT_BLOCK_PRELOADER,
  ForwardedRefComponent,
  RangedBlockProps,
  ZOD_EMPTY_OBJ,
} from '../../utils/types';
import { z } from 'zod';

export interface CallBlockProps<T = object>
  extends RangedBlockProps<CallBlockRenderData> {
  /** Custom renderer. */
  readonly renderer?: (
    data: CallBlockRenderData,
    children: React.ReactNode,
    isHovered: boolean,
  ) => React.ReactNode;

  /** Callback when the block is clicked. */
  readonly onClick?: (data: CallBlockRenderData) => void;

  /** Ratio of the call hint if applicable. */
  readonly hintRatio?: number;

  /** Custom options. */
  readonly options: T;
}

export type CallBlockComponentType = ForwardedRefComponent<CallBlockProps>;

export interface CallBlockEntry {
  component: CallBlockComponentType;
  preloader: BlockPreloader;
  optionsType: z.ZodType;
}

export const callBlockRegistry = new Registry<CallBlockEntry>('CallBlock');

export function registerCallBlock(
  key: string,
  component: CallBlockComponentType,
  optionsType: z.ZodType = ZOD_EMPTY_OBJ,
  preloader: BlockPreloader = DEFAULT_BLOCK_PRELOADER,
): void {
  callBlockRegistry.register(key, {
    component,
    preloader,
    optionsType,
  });
}
