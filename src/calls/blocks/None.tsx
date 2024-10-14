import { forwardRef } from 'react';
import { registerCallBlock } from './registry';

const NoneCallBlock = forwardRef(() => null);

export default NoneCallBlock;

registerCallBlock('None', NoneCallBlock);
