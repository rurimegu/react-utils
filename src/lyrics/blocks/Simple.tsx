import { AnnotationRenderData, Lerp } from '@rurino/core';
import clsx from 'clsx';
import { forwardRef, Ref } from 'react';
import { LyricsBlockProps, registerLyricsBlock } from './registry';
import { useHover } from '@uidotdev/usehooks';
import { z } from 'zod';

const OptionsType = z
  .object({
    lyricsClassName: z.string().default('text-xl'),
    annotationClassName: z.string().default('text-xs -mb-1.5'),
  })
  .strict()
  .default({});
type OptionsType = z.infer<typeof OptionsType>;

const SimpleBlock = forwardRef(function (
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
  const mainDiv = (
    <div
      className={clsx(
        '-mx-px px-px rounded-lg',
        className,
        onClick && 'hover:bg-opacity-40 hover:bg-blue-300 cursor-pointer',
      )}
      ref={hoverRef}
      style={style}
      onClick={onClick && (() => onClick(data))}
    >
      <div
        ref={isAnnotation ? ref : undefined}
        className={clsx(
          'font-bold pointer-events-none overflow-visible !leading-[normal]',
          isAnnotation ? options.annotationClassName : options.lyricsClassName,
        )}
        style={{
          opacity: Lerp(1, 0.3, ratios[1]),
        }}
      >
        {text}
      </div>
    </div>
  );

  // Save some performance
  return renderer ? renderer(data, mainDiv, hovered) : mainDiv;
});
SimpleBlock.displayName = 'SimpleBlock';

export default SimpleBlock;

registerLyricsBlock('Simple', SimpleBlock, OptionsType);
