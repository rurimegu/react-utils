import {
  Bisect,
  ApproxEqual,
  Clamp,
  InverseLerp,
  Lerp,
  Unreachable,
} from '@rurino/core';
import { easeLinear } from 'd3-ease';

export type EasingFunction = (input: number) => number;
interface AnimationKeyframe {
  time: number;
  value: number;
  easing?: EasingFunction;
}

export function interpolate(
  time: number,
  range: number[],
  output: number[],
  ease: EasingFunction = easeLinear,
) {
  time = Clamp(time, range[0], range[range.length - 1]);
  for (let i = 0; i < range.length - 1; i++) {
    if (time >= range[i] && time <= range[i + 1]) {
      const ratio = InverseLerp(range[i], range[i + 1], time);
      return Lerp(output[i], output[i + 1], ease(ratio));
    }
  }
  throw new Unreachable();
}

export class AnimationSequence extends Array<AnimationKeyframe> {
  public getValue(time: number) {
    const i = Bisect(this, (t) => t.time < time);
    if (i >= this.length) return this[this.length - 1].value;
    if (i === 0) return this[0].value;
    const next = this[i];
    const curr = this[i - 1];
    if (ApproxEqual(curr.time, next.time)) return curr.value;
    const { easing = easeLinear } = curr;
    return interpolate(
      time,
      [curr.time, next.time],
      [curr.value, next.value],
      easing,
    );
  }

  public get last() {
    return this[this.length - 1];
  }

  public get empty() {
    return this.length === 0;
  }

  public static Constant(value: number) {
    return new AnimationSequence({ time: 0, value });
  }
}
