import clsx from 'clsx';
import { easeCubicIn, easeCubicOut, easeLinear } from 'd3-ease';
import { forwardRef, Ref, useMemo } from 'react';
import { CallBlockProps, registerCallBlock } from './registry';
import { useHover } from '@uidotdev/usehooks';
import { AnimationSequence } from '../../utils/animate';
import SimpleHint from './SimpleHint';
import { mergeRefs } from '../../utils/hooks';
import { defaultCallPreloader } from '../../utils/types';
import { ratiosToTime } from '../../utils/math';
import { z } from 'zod';

const ANIMATION = {
  CALL_DURATION_S: 0.5,
  CALL_PEAK_OFFSET_S: 0.1,
};

const SimpleCallBlock = forwardRef(
  (
    {
      data,
      ratios,
      hintRatio,
      preloaded,
      renderer,
      onClick,
      className,
      style,
    }: CallBlockProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const text = data.text === ' ' ? '\u00A0' : data.text;
    const repeats = data.parent!.parent!.repeatOffsets;
    const scaleSequence = useMemo(() => {
      const seq = new AnimationSequence();
      let duration = data.end - data.start;
      let outEase = easeCubicOut;
      if (duration > ANIMATION.CALL_DURATION_S) {
        outEase = easeCubicIn;
      } else {
        duration = ANIMATION.CALL_DURATION_S;
      }
      for (const offset of repeats) {
        // Change display based on ratio
        const start = data.start + offset;
        while (!seq.empty && seq.last.time > start) {
          seq.pop();
        }

        // Enlarge text
        seq.push({
          time: start,
          value: 1,
          easing: easeCubicIn,
        });
        seq.push({
          time: start + ANIMATION.CALL_PEAK_OFFSET_S,
          value: 1.5,
          easing: outEase,
        });
        seq.push({
          time: start + duration,
          value: 1,
          easing: easeLinear,
        });
      }
      return seq;
    }, [data.start, data.end, repeats]);
    const scale = scaleSequence.getValue(
      ratiosToTime(data.start, ratios, preloaded),
    );
    // Check left position
    style = {
      color: '#df2020',
      transform: `scale(${scale})`,
      ...style,
    };

    // Handle hover
    const [hoverRef, hovered] = useHover();
    const mainDiv = (
      <div
        className={clsx(
          'inline-flex justify-center text-center text-nowrap px-px',
          'text-sm',
          onClick &&
            'hover:bg-yellow-300 hover:bg-opacity-50 cursor-pointer rounded-md',
          className,
        )}
        style={style}
        ref={mergeRefs<HTMLDivElement>(ref, hoverRef)}
        onClick={() => onClick?.(data)}
      >
        {hintRatio !== undefined && <SimpleHint ratio={hintRatio} />}
        {text}
      </div>
    );

    return renderer ? renderer(data, mainDiv, hovered) : mainDiv;
  },
);

export default SimpleCallBlock;

registerCallBlock(
  'Simple',
  SimpleCallBlock,
  z.object({}),
  defaultCallPreloader(ANIMATION.CALL_DURATION_S),
);
