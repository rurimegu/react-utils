import { CallLineRenderData, LyricsLineRenderData } from '@rurino/core';
import { memo, useMemo } from 'react';
import { LyricsHintEntry } from './hints/registry';
import { LyricsBlockEntry } from './blocks/registry';
import LyricsBlockWrapper, {
  LyricsBlockExtraProps,
} from './LyricsBlockWrapper';
import { CallBlockEntry } from '../calls';
import CallBlockWrapper, {
  CallBlockExtraProps,
  CallBlocksWrapperProps,
} from '../calls/CallBlockWrapper';
import LyricsHintWrapper, { LyricsHintExtraProps } from './LyricsHintWrapper';
import { calcRatios } from '../utils/math';
import _ from 'lodash';

function getRatios({
  data,
  calls,
  lyricsBlock,
  callBlock,
  time,
}: LyricsLineProps) {
  let preloaded = lyricsBlock.preloader(data);
  if (calls.length > 0) {
    const callFirstBlock = calls[0].children[0].children[0];
    const callLastBlock = calls[calls.length - 1].last.last;
    const callFirst = callBlock.preloader(callFirstBlock);
    const callLast = callBlock.preloader(callLastBlock);
    const start = Math.min(
      data.start - preloaded.preloadSecs,
      callFirstBlock.start - callFirst.preloadSecs,
    );
    const end = Math.max(
      data.start + preloaded.durationSecs + preloaded.delaySecs,
      callLastBlock.start + callLast.durationSecs + callLast.delaySecs,
    );
    preloaded = {
      preloadSecs: data.start - start,
      durationSecs: data.start + preloaded.durationSecs,
      delaySecs: end - (data.start + preloaded.durationSecs),
    };
  }
  return calcRatios(data.start, time, preloaded);
}

export interface LyricsLineProps {
  readonly data: LyricsLineRenderData;
  readonly calls: CallLineRenderData[];
  readonly time: number;
  readonly lyricsBlock: LyricsBlockEntry;
  readonly lyricsBlockProps?: LyricsBlockExtraProps;
  readonly callBlock: CallBlockEntry;
  readonly callBlockProps?: CallBlockExtraProps;
  readonly callTextClassName?: string;
  readonly callTextStyle?: React.CSSProperties;
  readonly hint: LyricsHintEntry;
  readonly hintProps?: LyricsHintExtraProps;
  readonly displayRuby: boolean;
  readonly displayCalls: boolean;
}

const LyricsLine = memo(
  ({
    data,
    calls,
    time,
    lyricsBlock,
    lyricsBlockProps,
    callBlock,
    callBlockProps,
    callTextClassName,
    callTextStyle,
    hint,
    hintProps,
    displayRuby,
    displayCalls,
  }: LyricsLineProps) => {
    const children = data.validChildren;
    const extraCalls = useMemo(() => {
      if (children.length > 0 || !displayCalls) return [];
      return calls.filter((c) => !c.isEmpty);
    }, [children, calls, displayCalls]);
    const callProps = useMemo(() => {
      const ret: Omit<CallBlocksWrapperProps, 'data' | 'time'> = {
        block: callBlock,
        blockProps: callBlockProps,
        textClassName: callTextClassName,
        textStyle: callTextStyle,
      };
      return ret;
    }, [callBlock, callBlockProps, callTextClassName, callTextStyle]);

    if (children.length > 0) {
      return (
        <>
          {children.map((b, i) => (
            <LyricsBlockWrapper
              key={`lbw-${i}`}
              data={b}
              calls={calls}
              time={time}
              block={lyricsBlock}
              callProps={callProps}
              blockProps={lyricsBlockProps}
              displayRuby={displayRuby}
              displayCalls={displayCalls}
            >
              {data.hint && i === 0 && (
                <LyricsHintWrapper
                  data={data.first}
                  time={time}
                  hint={hint}
                  hintProps={hintProps}
                />
              )}
            </LyricsBlockWrapper>
          ))}
        </>
      );
    } else {
      return (
        <div className="inline-flex space-x-1">
          {extraCalls
            .flatMap((c) => c.children)
            .map((c, i) => (
              <CallBlockWrapper
                key={`cc-${i}`}
                data={c}
                time={time}
                block={callBlock}
                blockProps={callBlockProps}
                textClassName={callTextClassName}
                textStyle={callTextStyle}
              />
            ))}
        </div>
      );
    }
  },
  (prev, next) => {
    for (const key in prev) {
      if (key === 'time') continue;
      const key2 = key as keyof LyricsLineProps;
      if (prev[key2] !== next[key2]) {
        return false;
      }
    }
    const prevRatios = getRatios(prev);
    const nextRatios = getRatios(next);
    if (!_.isEqual(prevRatios, nextRatios)) {
      return false;
    }
    return true;
  },
);

export default LyricsLine;
