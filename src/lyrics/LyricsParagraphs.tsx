import { LyricsTrackRenderData } from '@rurino/core';
import React from 'react';
import LyricsParagraph, { LyricsParagraphProps } from './LyricsParagraph';

interface LyricsParagraphsProps
  extends Omit<LyricsParagraphProps, 'data' | 'calls'> {
  readonly data: LyricsTrackRenderData;
  readonly refSetter: (index: number) => React.Ref<HTMLDivElement>;
}

function LyricsParagraphs({ data, refSetter, ...rest }: LyricsParagraphsProps) {
  return (
    <div className="inline-flex flex-col space-y-1">
      {data.map((l, idx) => (
        <LyricsParagraph
          key={`lp-${idx}`}
          data={l}
          {...rest}
          ref={refSetter(idx)}
        />
      ))}
    </div>
  );
}

export default LyricsParagraphs;
