import { forwardRef, Ref } from 'react';
import { LyricsParaProps, registerLyricsPara } from './registry';

const SimplePara = forwardRef(function (
  { data, children, renderer }: LyricsParaProps,
  ref: Ref<HTMLDivElement>,
) {
  const mainDiv = <div ref={ref}>{children}</div>;
  return renderer ? renderer(data, mainDiv, false) : mainDiv;
});
SimplePara.displayName = 'SimplePara';

export default SimplePara;

registerLyricsPara('Simple', SimplePara);
