import {
  LyricsMultiParagraphRenderData,
  LyricsTrackRenderData,
} from '@rurino/core';
import LyricsLine, { LyricsLineProps } from './LyricsLine';
import { Fragment } from 'react';

interface LyricsParagraphProps extends Omit<LyricsLineProps, 'data' | 'calls'> {
  readonly data: LyricsMultiParagraphRenderData;
}

interface LyricsParagraphsProps
  extends Omit<LyricsParagraphProps, 'data' | 'calls'> {
  readonly data: LyricsTrackRenderData;
}

function LyricsParagraph({ data, ...rest }: LyricsParagraphProps) {
  return (
    <div className="flex flex-wrap items-baseline min-h-1">
      {data.map((l, i) => (
        <Fragment key={`ll-${i}`}>
          {i > 0 && <div className="w-4 h-1" />}
          <LyricsLine data={l.lyrics} calls={l.calls.flat()} {...rest} />
        </Fragment>
      ))}
    </div>
  );
}

function LyricsParagraphs({ data, ...rest }: LyricsParagraphsProps) {
  return (
    <div className="inline-flex flex-col space-y-1">
      {data.map((l, idx) => (
        <LyricsParagraph key={`lp-${idx}`} data={l} {...rest} />
      ))}
    </div>
  );
}

export default LyricsParagraphs;
