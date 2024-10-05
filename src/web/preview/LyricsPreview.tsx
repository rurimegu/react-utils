import {
  AnimateConfig,
  LyricsStore,
  LyricsStoreData,
  RenderDataConverter,
} from '@rurino/core';
import {
  LyricsBlockExtraProps,
  lyricsBlockRegistry,
  lyricsHintRegistry,
  LyricsParagraphs,
} from '../../lyrics';
import EXAMPLE from './example.yaml';
import { CallBlockExtraProps, callBlockRegistry } from '../../calls';
import { useMemo, useState } from 'react';
import DemoPlayer from './DemoPlayer';

const DURATION = 38;
const LYRICS_RENDER_DATA = new RenderDataConverter(
  AnimateConfig.parse({}),
  LyricsStore.From(EXAMPLE as LyricsStoreData),
).convert(DURATION);

interface LyricsPreviewItem {
  type: string;
  options: object;
}

interface LyricsPreviewProps {
  lyricsBlock: LyricsPreviewItem;
  callBlock: LyricsPreviewItem;
  lyricsHint: LyricsPreviewItem;
}

export function LyricsPreview({
  lyricsBlock,
  callBlock,
  lyricsHint,
}: LyricsPreviewProps) {
  const [time, setTime] = useState(5);
  const lyricsBlockProps = useMemo<LyricsBlockExtraProps>(
    () => ({
      className: 'noto-serif-jp',
      options: lyricsBlock.options,
    }),
    [lyricsBlock.options],
  );
  const callBlockProps = useMemo<CallBlockExtraProps>(
    () => ({
      className: 'font-sans font-bold',
      options: callBlock.options,
    }),
    [callBlock.options],
  );

  return (
    <div>
      <div className="font-sans text-4xl text-gray-500">Preview</div>
      <DemoPlayer time={time} setTime={setTime} duration={DURATION} />
      <LyricsParagraphs
        data={LYRICS_RENDER_DATA.lyrics}
        time={time}
        lyricsBlock={lyricsBlockRegistry.get(lyricsBlock.type)!}
        lyricsBlockProps={lyricsBlockProps}
        callBlock={callBlockRegistry.get(callBlock.type)!}
        callBlockProps={callBlockProps}
        callTextClassName="font-sans font-bold text-blue-500"
        hint={lyricsHintRegistry.get(lyricsHint.type)!}
        displayRuby
        displayCalls
      />
    </div>
  );
}
