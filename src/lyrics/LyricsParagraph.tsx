import { LyricsMultiParagraphRenderData } from '@rurino/core';
import LyricsLine, { LyricsLineProps } from './LyricsLine';
import React, { forwardRef, Fragment, useMemo } from 'react';
import { LyricsParaEntry, LyricsParaProps } from './paragraph';
import { calcRatios } from '../utils/math';

export type LyricsParaExtraProps = Pick<
  LyricsParaProps,
  'renderer' | 'className' | 'style'
> & {
  options?: any;
};

export interface LyricsParagraphProps
  extends Omit<LyricsLineProps, 'data' | 'calls'> {
  readonly data: LyricsMultiParagraphRenderData;
  readonly lyricsPara: LyricsParaEntry;
  readonly lyricsParaProps?: LyricsParaExtraProps;
}

function getPropsForPara(
  block: LyricsParaEntry,
  data: LyricsMultiParagraphRenderData,
  time: number,
  extra?: LyricsParaExtraProps,
): LyricsParaProps {
  const options = block.optionsType.parse(extra?.options) as object;
  const preloaded = block.preloader(data, options);
  const ratios = calcRatios(data.start, time, preloaded);
  const ret: LyricsParaProps = {
    preloaded,
    data,
    ratios,
    ...extra,
    options,
  };
  return ret;
}

const LyricsParagraph = forwardRef(function (
  { data, lyricsPara, lyricsParaProps, ...rest }: LyricsParagraphProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const calls = useMemo(() => data.map((l) => l.calls.flat()), [data]);
  const Component = lyricsPara.component;
  const paraProps = getPropsForPara(
    lyricsPara,
    data,
    rest.time,
    lyricsParaProps,
  );
  return (
    <Component {...paraProps} childRef={ref}>
      <div className="flex flex-wrap items-baseline min-h-1" ref={ref}>
        {data.map((l, i) => (
          <Fragment key={`ll-${i}`}>
            {i > 0 && <div className="w-4 h-1" />}
            <LyricsLine data={l.lyrics} calls={calls[i]} {...rest} />
          </Fragment>
        ))}
      </div>
    </Component>
  );
});

export default LyricsParagraph;
