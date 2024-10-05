import ControlPanel from './control/ControlPanel';

function App() {
  return (
    <>
      <div className="text-3xl text-center w-full bg-slate-500 text-white py-1 text-nowrap font-sans">
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
        <ControlPanel />
      </div>
    </>
  );
}

export default App;
