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
  lyricsBlockProps,
  callBlock,
  callBlockProps,
  time,
}: LyricsLineProps) {
  let preloaded = data.isEmpty
    ? undefined
    : lyricsBlock.preloader(data, lyricsBlockProps?.options);
  let oldStart = data.start;
  if (calls.length > 0) {
    const callFirstBlock = calls[0].children[0].children[0];
    const callLastBlock = calls[calls.length - 1].last.last;
    const repeatOffsets = callLastBlock.parent!.parent!.repeatOffsets;
    const callLastBlockStart =
      callLastBlock.start + repeatOffsets[repeatOffsets.length - 1];
    const callLastBlockEnd =
      callLastBlock.end + repeatOffsets[repeatOffsets.length - 1];
    if (preloaded === undefined) {
      preloaded = {
        preloadSecs: 0,
        durationSecs: callLastBlockEnd - callFirstBlock.start,
        delaySecs: 0,
      };
      oldStart = callFirstBlock.start;
    } else {
      oldStart = data.start;
    }
    const callFirst = callBlock.preloader(
      callFirstBlock,
      callBlockProps?.options,
    );
    const callLast = callBlock.preloader(
      callLastBlock,
      callBlockProps?.options,
    );
    const start = Math.min(
      oldStart - preloaded.preloadSecs,
      callFirstBlock.start - callFirst.preloadSecs,
    );
    const end = Math.max(
      oldStart + preloaded.durationSecs + preloaded.delaySecs,
      callLastBlockStart + callLast.durationSecs + callLast.delaySecs,
    );
    preloaded = {
      preloadSecs: oldStart - start,
      durationSecs: preloaded.durationSecs,
      delaySecs: end - (oldStart + preloaded.durationSecs),
    };
  }
  return calcRatios(
    oldStart,
    time,
    preloaded ?? {
      preloadSecs: 0,
      durationSecs: data.end - data.start,
      delaySecs: 0,
    },
  );
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
  readonly displaySingAlong: boolean;
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
    displaySingAlong,
  }: LyricsLineProps) => {
    const children = data.validChildren;
    const extraCalls = useMemo(() => {
      if (children.length > 0) return [];
      return calls
        .filter((c) => !c.isEmpty)
        .flatMap((c) => c.children)
        .filter(
          (c) =>
            (displayCalls && !c.isSingAlong) ||
            (displaySingAlong && c.isSingAlong),
        );
    }, [children, calls, displayCalls, displaySingAlong]);
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
          {extraCalls.map((c, i) => (
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
