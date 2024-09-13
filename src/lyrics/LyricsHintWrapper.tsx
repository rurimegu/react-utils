import { LyricsBlockRenderData } from '@rurino/core';
import { forwardRef, Ref, useMemo } from 'react';
import { LyricsHintEntry, LyricsHintProps } from './hints/registry';
import { calcRatios } from '../utils/math';
export type LyricsHintExtraProps = Pick<
  LyricsHintProps,
  'renderer' | 'onClick' | 'className'
>;

interface LyricsHintWrapperProps {
  readonly data: LyricsBlockRenderData;
  readonly time: number;
  readonly hint: LyricsHintEntry;
  readonly hintProps: LyricsHintExtraProps;
}

const LyricsHintWrapper = forwardRef(function (
  { data, time, hint, hintProps }: LyricsHintWrapperProps,
  ref: Ref<HTMLDivElement>,
) {
  const preloaded = useMemo(() => hint.preloader(data), [data, hint]);
  const hintTime = data.parent!.hint!;
  const ratios = useMemo(
    () => calcRatios(data.start - hintTime, data.start, time, preloaded),
    [data, hintTime, time, preloaded],
  );

  const Component = hint.component;

  return (
    <Component
      data={data}
      preloaded={preloaded}
      ratios={ratios}
      ref={ref}
      {...hintProps}
    />
  );
});
LyricsHintWrapper.displayName = 'LyricsHintWrapper';

export default LyricsHintWrapper;
