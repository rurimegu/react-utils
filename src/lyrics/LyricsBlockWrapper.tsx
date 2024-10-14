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
import { forwardRef, memo, Ref, useMemo } from 'react';
import {
  LyricsBlockComponentType,
  LyricsBlockEntry,
  LyricsBlockProps,
} from './blocks/registry';
import { calcRatios } from '../utils/math';
import CallBlockWrapper, {
  CallBlocksWrapperProps,
} from '../calls/CallBlockWrapper';
import _ from 'lodash';
import clsx from 'clsx';
export type LyricsBlockExtraProps = Pick<
  LyricsBlockProps,
  'renderer' | 'onClick' | 'className' | 'style'
> & {
  options?: any;
};

export type CallBlockWrapperExtraProps = Omit<
  CallBlocksWrapperProps,
  'data' | 'time'
>;

interface LyricsBlockWrapperProps {
  readonly data: LyricsBlockRenderData;
  readonly calls: CallLineRenderData[];
  readonly time: number;
  readonly block: LyricsBlockEntry;
  readonly callProps: CallBlockWrapperExtraProps;
  readonly blockProps?: LyricsBlockExtraProps;
  readonly displayRuby?: boolean;
  readonly displayCalls?: boolean;
  readonly displaySingAlong?: boolean;
  readonly children?: React.ReactNode;
}

interface InnerLyricsBlockWrapperProps {
  readonly data: LyricsBlockRenderData;
  readonly time: number;
  readonly block: LyricsBlockEntry;
  readonly blockProps?: LyricsBlockExtraProps;
  readonly displayRuby?: boolean;
}

interface LyricsOrAnnotationBlockProps {
  readonly component: LyricsBlockComponentType;
  readonly blockProps: LyricsBlockProps;
  readonly childProps?: LyricsBlockProps[];
}

function compareProps(
  prev: LyricsBlockProps | undefined,
  next: LyricsBlockProps | undefined,
) {
  if (Boolean(prev) !== Boolean(next)) return false;
  if (prev && next) {
    if (!_.isEqual(prev.preloaded, next.preloaded)) return false;
    if (!_.isEqual(prev.ratios, next.ratios)) return false;
    if (prev.data !== next.data) return false;
    if (prev.renderer !== next.renderer) return false;
    if (prev.onClick !== next.onClick) return false;
    if (prev.className !== next.className) return false;
    if (prev.style !== next.style) return false;
    if (prev.options !== next.options) return false;
  }
  return true;
}

const LyricsOrAnnotationBlock = memo(
  forwardRef(function _LyricsOrAnnotationBlock(
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
  }),
  (prev, next) => {
    if (prev.component !== next.component) return false;
    if (!compareProps(prev.blockProps, next.blockProps)) return false;
    if (Boolean(prev.childProps) !== Boolean(next.childProps)) return false;
    if (prev.childProps) {
      for (let i = 0; i < prev.childProps.length; i++)
        if (!compareProps(prev.childProps[i], next.childProps![i]))
          return false;
    }
    return true;
  },
);
LyricsOrAnnotationBlock.displayName = 'LyricsOrAnnotationBlock';

function getPropsForBlock(
  block: LyricsBlockEntry,
  data: LyricsBlockRenderData | AnnotationRenderData,
  time: number,
  blockProps?: LyricsBlockExtraProps,
) {
  const options = block.optionsType.parse(blockProps?.options) as object;
  const preloaded = block.preloader(data, options);
  const ratios = calcRatios(data.start, time, preloaded);
  const ret: LyricsBlockProps = {
    preloaded,
    data,
    ratios,
    ...blockProps,
    options,
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
    callProps,
    time,
    block,
    blockProps,
    displayRuby,
    displayCalls,
    displaySingAlong,
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
      displaySingAlong
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
    [data, calls, displaySingAlong],
  );

  const callDiv = useMemo(() => {
    if (relatedCalls.length > 0) {
      const startPercent = Clamp01(
        InverseLerp(data.start, data.end, relatedCalls[0].start),
      );
      return (
        <div
          className="w-0 min-w-full self-stretch flex items-end justify-start"
          style={{
            marginLeft: `${startPercent * 100}%`,
          }}
        >
          {relatedCalls.map((c, i) => {
            return (
              <CallBlockWrapper
                key={`cb-${i}`}
                {...callProps}
                data={c}
                time={time}
              />
            );
          })}
        </div>
      );
    }
  }, [data, relatedCalls, time, callProps]);

  return (
    <div className="flex flex-col items-stretch">
      <div className="flex items-stretch relative">
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
        <div className={clsx('absolute', 'bottom-0')}>{children}</div>
      </div>
      {callDiv}
      {relatedSingAlong && (
        <div className="w-0 min-w-full self-stretch flex items-end justify-center">
          <CallBlockWrapper
            {...callProps}
            data={relatedSingAlong}
            time={time}
          />
        </div>
      )}
    </div>
  );
});
LyricsBlockWrapper.displayName = 'LyricsBlockWrapper';

export default LyricsBlockWrapper;
