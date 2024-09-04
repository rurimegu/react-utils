import {
  AnnotationRenderData,
  ApproxEqual,
  ApproxGeq,
  ApproxLess,
  CallLineRenderData,
  Clamp01,
  InverseLerp,
  LyricsBlockRenderData,
} from '@rurino/core';
import _ from 'lodash';
import { forwardRef, Ref, useMemo } from 'react';
import {
  LyricsBlockComponentType,
  LyricsBlockEntry,
  LyricsBlockProps,
} from './blocks/registry';
import { calcRatios } from '../utils/math';
export type LyricsBlockExtraProps = Pick<
  LyricsBlockProps,
  'renderer' | 'onClick' | 'className'
>;

interface LyricsBlockWrapperProps {
  readonly data: LyricsBlockRenderData;
  readonly calls: CallLineRenderData[];
  readonly time: number;
  readonly block: LyricsBlockEntry;
  readonly blockProps: LyricsBlockExtraProps;
  readonly displayRuby: boolean;
  readonly displayCalls: boolean;
  readonly children?: React.ReactNode;
}

interface InnerLyricsBlockWrapperProps {
  readonly data: LyricsBlockRenderData;
  readonly time: number;
  readonly block: LyricsBlockEntry;
  readonly blockProps: LyricsBlockExtraProps;
  readonly displayRuby: boolean;
}

interface LyricsOrAnnotationBlockProps {
  readonly component: LyricsBlockComponentType;
  readonly blockProps: LyricsBlockProps;
  readonly childProps?: LyricsBlockProps[];
}

const LyricsOrAnnotationBlock = forwardRef(function _LyricsOrAnnotationBlock(
  {
    component: Component,
    blockProps,
    childProps,
  }: LyricsOrAnnotationBlockProps,
  ref: Ref<HTMLDivElement>,
) {
  // Handle data
  const { data } = blockProps;
  const isAnnotation = data instanceof AnnotationRenderData;
  if (isAnnotation) {
    return <Component ref={ref} {...blockProps} />;
  }

  const children =
    childProps?.map((p, i) => <Component key={`a-${i}`} {...p} />) ?? [];

  return (
    <div ref={ref} className="inline-flex flex-col items-center">
      {children.length > 0 ? (
        <div className="flex items-start h-3.5">{children}</div>
      ) : null}
      <Component {...blockProps} />
    </div>
  );
});
LyricsOrAnnotationBlock.displayName = 'LyricsOrAnnotationBlock';

function getPropsForBlock(
  block: LyricsBlockEntry,
  data: LyricsBlockRenderData | AnnotationRenderData,
  time: number,
  blockProps: LyricsBlockExtraProps,
) {
  const preloaded = block.preloader(data);
  const ratios = calcRatios(data.start, data.end, time, preloaded);
  const ret: LyricsBlockProps = {
    preloaded,
    data,
    ratios,
    ...blockProps,
  };
  return ret;
}

const InnerLyricsBlock = forwardRef(function InnerLyricsBlock(
  { data, time, block, blockProps, displayRuby }: InnerLyricsBlockWrapperProps,
  ref: Ref<HTMLDivElement>,
) {
  // Optimize rendering
  const parentProps = useMemo(
    () => getPropsForBlock(block, data, time, blockProps),
    [block, data, time, blockProps],
  );
  const childProps = useMemo(
    () =>
      displayRuby
        ? data.children.map((c) => getPropsForBlock(block, c, time, blockProps))
        : undefined,
    [block, data, time, blockProps, displayRuby],
  );

  return (
    <LyricsOrAnnotationBlock
      ref={ref}
      component={block.component}
      blockProps={parentProps}
      childProps={childProps}
    />
  );
});
InnerLyricsBlock.displayName = 'InnerLyricsBlock';

const LyricsBlockWrapper = forwardRef(function LyricsBlock(
  {
    data,
    calls,
    time,
    block,
    blockProps,
    displayRuby,
    displayCalls,
    children,
  }: LyricsBlockWrapperProps,
  ref: Ref<HTMLDivElement>,
) {
  const relatedCalls = useMemo(
    () =>
      displayCalls
        ? calls
            .flatMap((c) => c.children)
            .filter((c) => {
              if (c.isSingAlong) return false;
              return (
                ApproxGeq(c.start, data.start) &&
                (data.next === undefined ||
                  ApproxLess(c.start, data.next.start))
              );
            })
        : [],
    [data, calls, displayCalls],
  );
  // We only allow 1 sing-along to be linked
  const relatedSingAlong = useMemo(
    () =>
      displayCalls
        ? calls
            .flatMap((c) => c.children)
            .filter((c) => c.isSingAlong)
            .flatMap((c) => c.children)
            .filter(
              (c) =>
                ApproxEqual(c.start, data.start) &&
                ApproxEqual(c.end, data.end),
            )[0]
        : undefined,
    [data, calls, displayCalls],
  );

  let callDiv: React.ReactNode | undefined;

  if (relatedCalls.length > 0) {
    const startPercent = Clamp01(
      InverseLerp(data.start, data.end, relatedCalls[0].start),
    );
    callDiv = (
      <div
        className="w-0 min-w-full h-3.5 self-stretch flex items-end justify-start"
        style={{
          marginLeft: `${startPercent * 100}%`,
        }}
      >
        {/* {relatedCalls.map((c, i) => {
          return <CallBlocks key={`cb-${i}`} data={c} />;
        })} */}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch relative">
      <div className="flex items-stretch">
        {/* For controling flex baseline */}
        <div className="inline-block" />
        <InnerLyricsBlock
          ref={ref}
          data={data}
          time={time}
          block={block}
          blockProps={blockProps}
          displayRuby={displayRuby}
        />
      </div>
      {callDiv}
      {/* {relatedSingAlong && (
          <div className="w-0 min-w-full h-3.5 self-stretch flex items-end justify-center">
            <CallBlock data={relatedSingAlong} />
          </div>
        )} */}
      {children}
    </div>
  );
});
LyricsBlockWrapper.displayName = 'LyricsBlockWrapper';

export default LyricsBlockWrapper;
