import { forwardRef } from 'react';
import { LyricsParaProps, registerLyricsPara } from './registry';

const SimplePara = forwardRef(function ({
  data,
  children,
  renderer,
}: LyricsParaProps) {
  return renderer ? renderer(data, children, false) : children;
});
SimplePara.displayName = 'SimplePara';

export default SimplePara;

registerLyricsPara('Simple', SimplePara);
