import { CallBlockRenderData } from '@rurino/core';
import { Registry } from '../../utils/registry';
import {
  BlockPreloader,
  DEFAULT_BLOCK_PRELOADER,
  ForwardedRefComponent,
  RangedBlockProps,
} from '../../utils/types';

export interface CallBlockProps extends RangedBlockProps<CallBlockRenderData> {
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
}

export type CallBlockComponentType = ForwardedRefComponent<CallBlockProps>;

export interface CallBlockEntry {
  component: CallBlockComponentType;
  preloader: BlockPreloader;
}

export const callBlockRegistry = new Registry<CallBlockEntry>('CallBlock');

export function registerCallBlock(
  key: string,
  component: CallBlockComponentType,
  preloader: BlockPreloader = DEFAULT_BLOCK_PRELOADER,
): void {
  callBlockRegistry.register(key, {
    component,
    preloader,
  });
}
