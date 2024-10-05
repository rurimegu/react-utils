import { callBlockRegistry } from '../calls';
import { lyricsBlockRegistry, lyricsHintRegistry } from '../lyrics';
import ControlPanel from './control/ControlPanel';
import { useControlPanelRegistry } from './control/utils';
import Header from './preview/Header';
import { LyricsPreview } from './preview/LyricsPreview';

function App() {
  const lyricsBlock = useControlPanelRegistry(lyricsBlockRegistry);
  const lyricsHint = useControlPanelRegistry(lyricsHintRegistry);
  const callBlock = useControlPanelRegistry(callBlockRegistry);

  return (
    <>
      <Header />
      <div className="w-full md:w-[48rem] lg:w-[64rem] mx-auto p-2 box-border">
        <ControlPanel
          lyricsBlock={lyricsBlock}
          lyricsHint={lyricsHint}
          callBlock={callBlock}
        />
        <LyricsPreview
          lyricsBlock={lyricsBlock}
          lyricsHint={lyricsHint}
          callBlock={callBlock}
        />
      </div>
    </>
  );
}

export default App;
