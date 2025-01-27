import { AnnotationRenderData, Clamp01 } from '@rurino/core';
import clsx from 'clsx';
import { forwardRef, Ref, useMemo } from 'react';
import { LyricsBlockProps, registerLyricsBlock } from './registry';
import { useHover } from '@uidotdev/usehooks';
import { mergeRefs } from '../../utils/hooks';
import styles from './Gradient.module.css';
import { getTextStrokeStyle } from '../../utils/web';
import { z } from 'zod';
import { AnimationSequence } from '../../utils/animate';
import { easeQuadIn, easeQuadOut } from 'd3-ease';
import { DEFAULT_BLOCK_PRELOADER } from '../../utils/types';
import { ratiosToTime } from '../../utils/math';

const MIN_ANIMATION_DURATION = 0.5;

const OptionsType = z
  .object({
    lyricsClassName: z.string().default('text-xl'),
    annotationClassName: z.string().default('text-xs -mb-1.5'),
    yTranslation: z.number().default(0.25),
    yMinorTranslation: z.number().default(0.15),
  })
  .strict()
  .default({});
type OptionsType = z.infer<typeof OptionsType>;

const PyonBlock = forwardRef(function (
  {
    data,
    ratios,
    preloaded,
    renderer,
    onClick,
    className,
    style,
    options,
  }: LyricsBlockProps<OptionsType>,
  ref: Ref<HTMLDivElement>,
) {
  // Handle data
  const [hoverRef, hovered] = useHover();
  const text = data.text === ' ' ? '\u00A0' : data.text;
  const isAnnotation = data instanceof AnnotationRenderData;
  const colors = isAnnotation ? data.parent!.colors : data.colors;
  // Y translation
  const maxYTranslation =
    isAnnotation || data.children.length === 0
      ? options.yTranslation
      : options.yMinorTranslation;
  const time = ratiosToTime(data.start, ratios, preloaded);
  const ratio = Clamp01(
    (time - data.start) / (preloaded.durationSecs + preloaded.delaySecs),
  );
  const yTranslationSeq = useMemo(() => {
    const seq = new AnimationSequence();
    seq.push({ time: 0, value: 0, easing: easeQuadOut });
    seq.push({ time: 0.5, value: -maxYTranslation, easing: easeQuadIn });
    seq.push({ time: 1, value: 0 });
    return seq;
  }, [maxYTranslation]);
  const yTranslation = yTranslationSeq.getValue(ratio);
  // Render
  const textStrokeStyle = useMemo(
    () => getTextStrokeStyle('to bottom', colors, ratios[1]),
    [colors, ratios],
  );
  const mainDiv = (
    <div
      className={clsx(
        onClick && 'hover:bg-opacity-40 hover:bg-blue-300 cursor-pointer',
        '-mx-px px-px rounded-lg',
        className,
      )}
      onClick={() => onClick?.(data)}
      ref={mergeRefs<HTMLDivElement>(hoverRef, ref)}
      style={{
        ...style,
        transform: `translateY(${yTranslation * 100}%)`,
      }}
    >
      <div
        ref={isAnnotation ? ref : undefined}
        className={clsx(
          styles.lyricsTextBlock,
          'bg-opacity-100 pointer-events-none overflow-visible !leading-[normal]',
          isAnnotation ? options.annotationClassName : options.lyricsClassName,
        )}
        style={{
          ...textStrokeStyle,
        }}
      >
        {text}
      </div>
    </div>
  );

  // Save some performance
  return renderer ? renderer(data, mainDiv, hovered) : mainDiv;
});
PyonBlock.displayName = 'PyonBlock';

export default PyonBlock;

registerLyricsBlock('Pyon', PyonBlock, OptionsType, (data, options) => {
  const ret = DEFAULT_BLOCK_PRELOADER(data, options);
  const delaySecs = Math.max(0, MIN_ANIMATION_DURATION - ret.durationSecs);
  return {
    ...ret,
    delaySecs,
  };
});
