import { AnnotationRenderData, Lerp } from '@rurino/core';
import clsx from 'clsx';
import { forwardRef, Ref } from 'react';
import { LyricsBlockProps, registerLyricsBlock } from './registry';
import { useHover } from '@uidotdev/usehooks';

const SimpleBlock = forwardRef(function (
  { data, ratios, renderer, onClick, className }: LyricsBlockProps,
  ref: Ref<HTMLDivElement>,
) {
  // Handle data
  const [hoverRef, hovered] = useHover();
  const text = data.text === ' ' ? '\u00A0' : data.text;
  const isAnnotation = data instanceof AnnotationRenderData;
  const mainDiv = (
    <div
      className={clsx(
        'hover:bg-opacity-40 hover:bg-blue-300 cursor-pointer',
        '-mx-px px-px rounded-lg',
        className,
      )}
      ref={hoverRef}
      onClick={onClick && (() => onClick(data))}
    >
      <div
        ref={isAnnotation ? ref : undefined}
        className={clsx(
          'font-bold',
          'pointer-events-none',
          'p-0.5 -m-0.5',
          !isAnnotation && '-mt-1',
          isAnnotation ? 'text-xs' : 'text-xl',
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
  return renderer?.(data, mainDiv, hovered) ?? mainDiv;
});
SimpleBlock.displayName = 'SimpleBlock';

export default SimpleBlock;

registerLyricsBlock('Simple', SimpleBlock);
