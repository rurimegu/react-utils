import { AnnotationRenderData, Color, GradientCss } from '@rurino/core';
import clsx from 'clsx';
import { CSSProperties, forwardRef, Ref, useMemo } from 'react';
import { LyricsBlockProps, registerLyricsBlock } from './registry';
import { useHover } from '@uidotdev/usehooks';
import { mergeRefs } from '../../utils/hooks';
import styles from './Gradient.module.css';

const DEFAULT_GRADIENT_COLORS = [Color.BLACK];

function getGradientColorOrDefault(
  direction: string,
  colors?: Color[],
  defaultValue = DEFAULT_GRADIENT_COLORS,
) {
  if (!colors || colors.length === 0) {
    colors = defaultValue;
  }
  colors = colors || DEFAULT_GRADIENT_COLORS;
  return GradientCss(direction, colors);
}

function getTextStrokeStyle(direction: string, colors: Color[], ratio: number) {
  const colorStr = getGradientColorOrDefault(direction, colors);
  const ret = {
    backgroundImage: colorStr,
    '--ratio': `${ratio * 100}%`,
  } as CSSProperties;
  return ret;
}

const GradientBlock = forwardRef(function (
  { data, ratios, renderer, onClick, className, style }: LyricsBlockProps,
  ref: Ref<HTMLDivElement>,
) {
  // Handle data
  const [hoverRef, hovered] = useHover();
  const text = data.text === ' ' ? '\u00A0' : data.text;
  const isAnnotation = data instanceof AnnotationRenderData;
  const colors = isAnnotation ? data.parent!.colors : data.colors;
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
      style={style}
    >
      <div
        ref={isAnnotation ? ref : undefined}
        className={clsx(
          styles.lyricsTextBlock,
          'bg-opacity-100 pointer-events-none',
          'p-0.5 -m-0.5',
          !isAnnotation && '-mt-1',
          isAnnotation ? 'text-xs' : 'text-xl',
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
GradientBlock.displayName = 'GradientBlock';

export default GradientBlock;

registerLyricsBlock('Gradient', GradientBlock);
