import { Color } from '@rurino/core';
import { forwardRef, useMemo } from 'react';
import { LyricsHintProps, registerLyricsHint } from './registry';
import { getGradientColorOrDefault, interpolate } from '../../utils/animate';
import { useHover } from '@uidotdev/usehooks';
import { mergeRefs } from '../../utils/hooks';
import clsx from 'clsx';
import { z } from 'zod';

const OptionsType = z
  .object({
    unitHintWidth: z.number().default(32),
  })
  .strict()
  .default({});
type OptionsType = z.infer<typeof OptionsType>;

const UnderlineHint = forwardRef(function (
  {
    data,
    preloaded,
    className = '-mb-0.5 h-1',
    ratios,
    renderer,
    onClick,
    style,
    options,
  }: LyricsHintProps<OptionsType>,
  ref: React.Ref<HTMLDivElement>,
) {
  const colorStr = useMemo(
    () => getGradientColorOrDefault('to right', data.colors, [Color.WHITE]),
    [data.colors],
  );
  const ratio = ratios[1];
  const [hoverRef, isHovered] = useHover();
  if (ratio <= 0 || ratio >= 1) return null;
  const duration = preloaded.durationSecs;
  const opaqueDurationPercent = Math.min(0.2, 0.2 / duration);
  const width = options.unitHintWidth * duration * (1 - ratio);
  const opacity = interpolate(ratio, [0, opaqueDurationPercent, 1], [0, 1, 1]);
  style = {
    ...style,
    opacity,
    backgroundImage: colorStr,
    width,
  };

  const mainDiv = (
    <div
      className={clsx(
        'bg-opacity-100 rounded-full shadow-sm shadow-slate-800',
        className,
      )}
      style={style}
      onClick={() => onClick?.(data)}
      ref={mergeRefs<HTMLDivElement>(ref, hoverRef)}
    />
  );
  return renderer ? renderer(data, mainDiv, isHovered) : mainDiv;
});
UnderlineHint.displayName = 'UnderlineHint';

export default UnderlineHint;

registerLyricsHint('Underline', UnderlineHint, OptionsType);
