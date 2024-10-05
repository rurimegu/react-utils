import { callBlockRegistry } from '../calls';
import { lyricsBlockRegistry, lyricsHintRegistry } from '../lyrics';
import ControlPanel from './control/ControlPanel';
import { useControlPanelRegistry } from './control/utils';
import { LyricsPreview } from './preview/LyricsPreview';

function App() {
  const lyricsBlock = useControlPanelRegistry(lyricsBlockRegistry);
  const lyricsHint = useControlPanelRegistry(lyricsHintRegistry);
  const callBlock = useControlPanelRegistry(callBlockRegistry);

  return (
    <>
      <div className="text-3xl text-center w-full bg-gray-500 text-white py-1 text-nowrap font-sans">
        <a
          href="https://github.com/rurimegu/react-utils"
          target="_blank"
          rel="noreferrer"
        >
          @rurino/react-utils
        </a>{' '}
        Preview Mode
        <span className="ml-2 text-base text-gray-300">{__APP_VERSION__}</span>
      </div>
      <div className="container mx-auto p-2">
        <ControlPanel
          lyricsBlock={lyricsBlock}
          lyricsHint={lyricsHint}
          callBlock={callBlock}
        />
        <LyricsPreview />
      </div>
    </>
  );
}

export default App;
