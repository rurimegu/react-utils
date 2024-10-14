import {
  CallBlockRenderData,
  CallBlocksRenderData,
  getNextStart,
} from '@rurino/core';
import { CallBlockEntry, CallBlockProps } from './blocks/registry';
import clsx from 'clsx';
import { calcRatios, lerpBlockTime } from '../utils/math';
import { useMemo } from 'react';
import { parseOptions } from '../utils/types';
import NoneCallBlock from './blocks/None';

export type CallBlockExtraProps = Pick<
  CallBlockProps,
  'renderer' | 'onClick' | 'className' | 'style'
> & {
  options?: any;
};

export interface CallBlocksWrapperProps {
  readonly data: CallBlocksRenderData | CallBlockRenderData;
  readonly time: number;
  readonly block: CallBlockEntry;
  readonly blockProps?: CallBlockExtraProps;
  readonly textClassName?: string;
  readonly textStyle?: React.CSSProperties;
  readonly options?: any;
}

interface SingAlongProps extends CallBlocksWrapperProps {
  readonly data: CallBlockRenderData;
}

interface CallBlocksProps extends CallBlocksWrapperProps {
  readonly data: CallBlocksRenderData;
}

function getPropsForBlock(
  block: CallBlockEntry,
  data: CallBlockRenderData,
  time: number,
  blockProps?: CallBlockExtraProps,
  hint?: number,
) {
  const options = parseOptions(
    block.optionsType,
    blockProps?.options,
  ) as object;
  const preloaded = block.preloader(data, options);
  const ratios = calcRatios(data.start, time, preloaded);
  const hintRatio = hint && lerpBlockTime(data.start - hint, data.start, time);
  const ret: CallBlockProps = {
    preloaded,
    data,
    ratios,
    hintRatio,
    ...blockProps,
    options,
  };
  return ret;
}

function CallBlocks({
  data,
  time,
  block,
  blockProps,
  textClassName,
  textStyle,
}: CallBlocksProps) {
  const parentChilds = data.parent!.children;
  const repeats = data.parent!.repeatOffsets;
  const parentMultiRepeat = parentChilds.length > 1 && repeats.length > 1;
  const leftBracket = parentMultiRepeat && data === parentChilds[0];
  const rightBracket =
    parentMultiRepeat && data === parentChilds[parentChilds.length - 1];
  // If the line is completely displayed, show the original count.
  let displayCount: number | undefined;
  if (repeats.length > 1 && data === parentChilds[parentChilds.length - 1]) {
    const nextStart = getNextStart(data.parent!.parent!.parent!.parent!);
    const futureCount = repeats.filter((r) => r + data.end >= time).length;
    displayCount =
      futureCount === 0 && time >= nextStart ? repeats.length : futureCount;
  }
  const CallBlock = block.component;

  const childProps = useMemo(
    () =>
      data.children.map((c) =>
        getPropsForBlock(
          block,
          c,
          time,
          blockProps,
          c.prev ? undefined : data.hint,
        ),
      ),
    [block, data, time, blockProps],
  );

  if (CallBlock === NoneCallBlock) return null;

  return (
    <div className="flex flex-nowrap">
      {leftBracket && (
        <div
          className={clsx('inline-block -ml-2 text-sm', textClassName)}
          style={textStyle}
        >
          [
        </div>
      )}
      {childProps.map((props, i) => {
        return <CallBlock key={`cl-${i}`} {...props} />;
      })}
      {displayCount !== undefined && (
        <div
          className={clsx('inline-block text-sm w-8', textClassName)}
          style={textStyle}
        >
          {rightBracket && <span>]</span>}
          <span>{displayCount > 0 ? `x${displayCount}` : ''}</span>
        </div>
      )}
    </div>
  );
}

function SingAlongBlock({ data, time, block, blockProps }: SingAlongProps) {
  const props = useMemo(
    () =>
      getPropsForBlock(
        block,
        data,
        time,
        blockProps,
        data.prev ? undefined : data.parent!.hint,
      ),
    [block, data, time, blockProps],
  );
  const CallBlock = block.component;
  return <CallBlock {...props} />;
}

function CallBlockWrapper(props: CallBlocksWrapperProps) {
  if (props.data instanceof CallBlockRenderData) {
    if (!props.data.parent!.isSingAlong)
      throw new Error('Only sing-along should be handled by SingAlongBlock');
    return <SingAlongBlock {...props} data={props.data} />;
  } else {
    if (props.data.isSingAlong)
      throw new Error('Sing-along should not be handled by CallBlocks');
    return <CallBlocks {...props} data={props.data} />;
  }
}

export default CallBlockWrapper;
