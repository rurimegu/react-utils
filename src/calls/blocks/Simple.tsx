import { InverseLerp } from '@rurino/core';
import clsx from 'clsx';
import { easeCubicIn, easeCubicOut, easeLinear } from 'd3-ease';
import { CSSProperties, useMemo } from 'react';
import { CallBlockProps } from './registry';
import { useHover } from '@uidotdev/usehooks';
import { AnimationSequence } from '../../utils/animate';
import SimpleHint from './SimpleHint';

const ANIMATION = {
  CALL_DURATION_S: 0.5,
  CALL_PEAK_OFFSET_S: 0.1,
};

function SimpleCallBlock({
  data,
  ratios,
  hintRatio,
  renderer,
  onClick,
  className,
}: CallBlockProps) {
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
        time: InverseLerp(data.start, data.end, start),
        value: 1,
        easing: easeCubicIn,
      });
      seq.push({
        time: InverseLerp(
          data.start,
          data.end,
          start + ANIMATION.CALL_PEAK_OFFSET_S,
        ),
        value: 1.5,
        easing: outEase,
      });
      seq.push({
        time: InverseLerp(data.start, data.end, start + duration),
        value: 1,
        easing: easeLinear,
      });
    }
    return seq;
  }, [data.start, data.end, repeats]);
  const scale = scaleSequence.getValue(ratios[1]);
  // Check left position
  const style: CSSProperties = {
    color: '#df2020',
    transform: `scale(${scale})`,
  };

  // Handle hover
  const [ref, hovered] = useHover();
  const mainDiv = (
    <div
      className={clsx(
        'inline-flex justify-center text-center text-nowrap',
        'text-sm font-bold',
        className,
      )}
      style={style}
      ref={ref}
      onClick={() => onClick?.(data)}
    >
      {hintRatio !== undefined && <SimpleHint ratio={hintRatio} />}
      {text}
    </div>
  );

  return renderer?.(data, mainDiv, hovered) ?? mainDiv;
}

export default SimpleCallBlock;
