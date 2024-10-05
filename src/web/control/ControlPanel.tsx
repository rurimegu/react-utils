import { callBlockRegistry } from '../../calls';
import { lyricsBlockRegistry, lyricsHintRegistry } from '../../lyrics';
import SelectorWithConfig from './SelectorWithConfig';

export interface ControlPanelRegistry {
  type: string;
  onTypeChange: (type: string) => void;
  onConfigChange: (config: any) => void;
}

interface ControlPanelProps {
  lyricsBlock: ControlPanelRegistry;
  lyricsHint: ControlPanelRegistry;
  callBlock: ControlPanelRegistry;
}

function ControlPanel({
  lyricsBlock,
  lyricsHint,
  callBlock,
}: ControlPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <SelectorWithConfig
        type={lyricsBlock.type}
        onTypeChange={lyricsBlock.onTypeChange}
        onConfigChange={lyricsBlock.onConfigChange}
        registry={lyricsBlockRegistry}
      />
      <SelectorWithConfig
        type={lyricsHint.type}
        onTypeChange={lyricsHint.onTypeChange}
        onConfigChange={lyricsHint.onConfigChange}
        registry={lyricsHintRegistry}
      />
      <SelectorWithConfig
        type={callBlock.type}
        onTypeChange={callBlock.onTypeChange}
        onConfigChange={callBlock.onConfigChange}
        registry={callBlockRegistry}
      />
    </div>
  );
}

export default ControlPanel;
