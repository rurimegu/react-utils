import { callBlockRegistry } from '../calls';
import { lyricsBlockRegistry, lyricsHintRegistry } from '../lyrics';
import { lyricsParaRegistry } from '../lyrics/paragraph/registry';
import ControlPanel from './control/ControlPanel';
import { useControlPanelRegistry } from './control/utils';
import Header from './preview/Header';
import { LyricsPreview } from './preview/LyricsPreview';

function App() {
  const lyricsBlock = useControlPanelRegistry(lyricsBlockRegistry);
  const lyricsLine = useControlPanelRegistry(lyricsParaRegistry);
  const lyricsHint = useControlPanelRegistry(lyricsHintRegistry);
  const callBlock = useControlPanelRegistry(callBlockRegistry);

  return (
    <>
      <Header />
      <div className="w-full md:w-[48rem] lg:w-[64rem] mx-auto p-2 box-border">
        <ControlPanel
          lyricsBlock={lyricsBlock}
          lyricsPara={lyricsLine}
          lyricsHint={lyricsHint}
          callBlock={callBlock}
        />
        <LyricsPreview
          lyricsBlock={lyricsBlock}
          lyricsLine={lyricsLine}
          lyricsHint={lyricsHint}
          callBlock={callBlock}
        />
      </div>
    </>
  );
}

export default App;
