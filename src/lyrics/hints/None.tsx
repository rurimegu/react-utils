import { forwardRef } from 'react';
import { registerLyricsHint } from './registry';

const NoneLyricsHint = forwardRef(() => null);

export default NoneLyricsHint;

registerLyricsHint('None', NoneLyricsHint);
