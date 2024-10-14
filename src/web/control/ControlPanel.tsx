import { callBlockRegistry } from '../../calls';
import {
  lyricsBlockRegistry,
  lyricsHintRegistry,
  lyricsParaRegistry,
} from '../../lyrics';
import SelectorWithConfig from './SelectorWithOptions';

export interface ControlPanelRegistry {
  type: string;
  onTypeChange: (type: string) => void;
  onOptionsChange: (config: any) => void;
}

interface ControlPanelProps {
  lyricsBlock: ControlPanelRegistry;
  lyricsPara: ControlPanelRegistry;
  lyricsHint: ControlPanelRegistry;
  callBlock: ControlPanelRegistry;
}

function ControlPanel({
  lyricsBlock,
  lyricsPara,
  lyricsHint,
  callBlock,
}: ControlPanelProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      <SelectorWithConfig
        type={lyricsBlock.type}
        onTypeChange={lyricsBlock.onTypeChange}
        onOptionsChange={lyricsBlock.onOptionsChange}
        registry={lyricsBlockRegistry}
      />
      <SelectorWithConfig
        type={lyricsPara.type}
        onTypeChange={lyricsPara.onTypeChange}
        onOptionsChange={lyricsPara.onOptionsChange}
        registry={lyricsParaRegistry}
      />
      <SelectorWithConfig
        type={lyricsHint.type}
        onTypeChange={lyricsHint.onTypeChange}
        onOptionsChange={lyricsHint.onOptionsChange}
        registry={lyricsHintRegistry}
      />
      <SelectorWithConfig
        type={callBlock.type}
        onTypeChange={callBlock.onTypeChange}
        onOptionsChange={callBlock.onOptionsChange}
        registry={callBlockRegistry}
      />
    </div>
  );
}

export default ControlPanel;
