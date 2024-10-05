import clsx from 'clsx';
import { Registry } from '../../utils/registry';
import JsonTextArea from './JsonTextArea';

interface SelectorWithConfigProps {
  registry: Registry<any>;
  className?: string;
}

function SelectorWithConfig({ registry, className }: SelectorWithConfigProps) {
  const selectElId = `cp-select-${registry.name}`;
  return (
    <div
      className={clsx(
        'p-2 border border-solid border-sky-500 rounded flex flex-col space-y-2',
        className,
      )}
    >
      <div className="w-full">
        <label htmlFor={selectElId} className="mr-2">
          {registry.name}
        </label>
        <select id={selectElId}>
          {[...registry.keys()].map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>
      </div>
      <JsonTextArea className="w-full" />
    </div>
  );
}

export default SelectorWithConfig;
