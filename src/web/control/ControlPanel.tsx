import { callBlockRegistry } from '../../calls';
import { lyricsBlockRegistry, lyricsHintRegistry } from '../../lyrics';
import SelectorWithConfig from './SelectorWithConfig';

function ControlPanel() {
  return (
    <div className="columns-1 md:columns-3">
      <SelectorWithConfig registry={lyricsBlockRegistry} />
      <SelectorWithConfig registry={lyricsHintRegistry} />
      <SelectorWithConfig registry={callBlockRegistry} />
    </div>
  );
}

export default ControlPanel;
