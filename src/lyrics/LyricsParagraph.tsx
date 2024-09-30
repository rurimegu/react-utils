import { LyricsMultiParagraphRenderData } from '@rurino/core';
import LyricsLine, { LyricsLineProps } from './LyricsLine';
import React, { forwardRef, Fragment, useMemo } from 'react';

export interface LyricsParagraphProps
  extends Omit<LyricsLineProps, 'data' | 'calls'> {
  readonly data: LyricsMultiParagraphRenderData;
}

const LyricsParagraph = forwardRef(function (
  { data, ...rest }: LyricsParagraphProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const calls = useMemo(() => data.map((l) => l.calls.flat()), [data]);
  return (
    <div className="flex flex-wrap items-baseline min-h-1" ref={ref}>
      {data.map((l, i) => (
        <Fragment key={`ll-${i}`}>
          {i > 0 && <div className="w-4 h-1" />}
          <LyricsLine data={l.lyrics} calls={calls[i]} {...rest} />
        </Fragment>
      ))}
    </div>
  );
});

export default LyricsParagraph;
