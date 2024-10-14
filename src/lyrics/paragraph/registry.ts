import { LyricsMultiParagraphRenderData } from '@rurino/core';
import { Registry } from '../../utils/registry';
import {
  ForwardedRefComponent,
  RangedBlockProps,
  RangePreloadData,
  ZOD_EMPTY_OBJ,
} from '../../utils/types';
import { z } from 'zod';

export interface LyricsParaProps<T = any>
  extends RangedBlockProps<LyricsMultiParagraphRenderData> {
  /** Custom renderer. */
  readonly renderer?: (
    data: LyricsMultiParagraphRenderData,
    children: React.ReactNode,
    isHovered: boolean,
  ) => React.ReactNode;

  /** Custom options. */
  readonly options: T;

  /** Children to render. */
  readonly children?: React.ReactNode;

  /** Ref to children. */
  readonly childRef?: React.Ref<HTMLDivElement>;
}

export type LyricsParaComponentType = ForwardedRefComponent<LyricsParaProps>;

export type ParaPreloader = (
  data: LyricsMultiParagraphRenderData,
  options: any,
) => RangePreloadData;

const DEFAULT_PARA_PRELOADER: ParaPreloader = (data) => {
  const ret: RangePreloadData = {
    preloadSecs: 0,
    durationSecs: data.end - data.start,
    delaySecs: 0,
  };
  return ret;
};

export interface LyricsParaEntry {
  component: LyricsParaComponentType;
  preloader: ParaPreloader;
  optionsType: z.ZodType;
}

export const lyricsParaRegistry = new Registry<LyricsParaEntry>('LyricsPara');

export function registerLyricsPara(
  key: string,
  component: LyricsParaComponentType,
  optionsType: z.ZodType = ZOD_EMPTY_OBJ,
  preloader: ParaPreloader = DEFAULT_PARA_PRELOADER,
): void {
  lyricsParaRegistry.register(key, {
    component,
    preloader,
    optionsType,
  });
}
