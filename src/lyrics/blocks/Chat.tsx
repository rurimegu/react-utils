import { AnnotationRenderData } from '@rurino/core';
import clsx from 'clsx';
import { forwardRef, Ref } from 'react';
import { LyricsBlockProps, registerLyricsBlock } from './registry';
import { useHover } from '@uidotdev/usehooks';
import { mergeRefs } from '../../utils/hooks';
import { z } from 'zod';

const OptionsType = z
  .object({
    lyricsClassName: z.string().default('text-xl'),
    lyricsWithSingAlongClassName: z.string().default('text-red-500'),
    annotationClassName: z.string().default('text-xs'),
  })
  .strict()
  .default({});
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
  const lyricsBlock = isAnnotation ? data.parent! : data;
  // Render
  const mainDiv = (
    <div
      className={clsx(
        onClick && 'hover:bg-opacity-40 hover:bg-blue-300 cursor-pointer',
        '-mx-px px-px rounded-lg',
        className,
        lyricsBlock.isSingAlong && options.lyricsWithSingAlongClassName,
      )}
      onClick={() => onClick?.(data)}
      ref={mergeRefs<HTMLDivElement>(hoverRef, ref)}
      style={style}
    >
      <div
        ref={isAnnotation ? ref : undefined}
        className={clsx(
          'bg-opacity-100 pointer-events-none',
          'p-0.5 -m-0.5',
          !isAnnotation && '-mt-1',
          isAnnotation ? options.annotationClassName : options.lyricsClassName,
          ratios[1] < 0 ? 'opacity-30' : 'opacity-100',
          ratios[1] >= 0 && ratios[1] <= 1 && 'underline',
          isAnnotation ? 'decoration-2' : 'decoration-4',
        )}
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
