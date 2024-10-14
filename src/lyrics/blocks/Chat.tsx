import { AnnotationRenderData } from '@rurino/core';
import clsx from 'clsx';
import { forwardRef, Ref, useMemo } from 'react';
import { LyricsBlockProps, registerLyricsBlock } from './registry';
import { useHover } from '@uidotdev/usehooks';
import { mergeRefs } from '../../utils/hooks';
import styles from './Gradient.module.css';
import { getTextStrokeStyle } from '../../utils/web';
import { z } from 'zod';

const OptionsType = z
  .object({
    lyricsClassName: z.string().default('text-xl'),
    annotationClassName: z.string().default('text-xs'),
  })
  .strict();
type OptionsType = z.infer<typeof OptionsType>;

const ChatBlock = forwardRef(function (
  {
    data,
    ratios,
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
ChatBlock.displayName = 'ChatBlock';

export default ChatBlock;

registerLyricsBlock('Chat', ChatBlock, OptionsType);
