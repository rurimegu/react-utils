import { Color, GradientCss } from '@rurino/core';
import { CSSProperties } from 'react';

const DEFAULT_GRADIENT_COLORS = [Color.BLACK];

export function getGradientColorOrDefault(
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

export function getTextStrokeStyle(
  direction: string,
  colors: Color[],
  ratio: number,
) {
  const colorStr = getGradientColorOrDefault(direction, colors);
  const ret = {
    backgroundImage: colorStr,
    '--ratio': `${ratio * 100}%`,
  } as CSSProperties;
  return ret;
}
