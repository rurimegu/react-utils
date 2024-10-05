import clsx from 'clsx';
import { Registry } from '../../utils/registry';
import JsonTextArea from './JsonTextArea';
import { useCallback, useState } from 'react';
import { ZodError } from 'zod';

interface SelectorWithOptionsProps {
  registry: Registry;
  className?: string;
  type: string;
  onTypeChange?: (type: string) => void;
  onOptionsChange?: (options: object) => void;
}

function SelectorWithOptions({
  registry,
  className,
  type,
  onTypeChange,
  onOptionsChange,
}: SelectorWithOptionsProps) {
  const [showTextArea, setShowTextArea] = useState(false);
  const [text, setText] = useState('{\n}');
  const [validationError, setValidationError] = useState<string>();
  const selectElId = `cp-select-${registry.name}`;

  const onBlur = useCallback(
    (obj: string) => {
      const entry = registry.get(type);
      if (!entry) return `Invalid ${registry.name} type.`;
      setText(obj);
      try {
        const optionsObj = entry.optionsType.parse(JSON.parse(obj)) as object;
        setValidationError(undefined);
        onOptionsChange?.(optionsObj);
      } catch (e) {
        if (e instanceof ZodError) {
          setValidationError(e.format()._errors.join('\n'));
        } else {
          setValidationError((e as Error).message);
        }
      }
    },
    [registry, type, onOptionsChange],
  );
  const onTypeChangeCallback = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value;
      onTypeChange?.(newType);
      onBlur(text);
    },
    [onTypeChange, onBlur, text],
  );

  return (
    <div
      className={clsx(
        'p-2 border border-solid border-pink-500 rounded flex flex-col space-y-2',
        className,
      )}
    >
      <div className="w-full">
        <label htmlFor={selectElId} className="mr-2">
          {registry.name}
        </label>
        <select id={selectElId} value={type} onChange={onTypeChangeCallback}>
          {[...registry.keys()].map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>
      </div>
      <div className="font-sans border rounded shadow shadow-violet-400">
        <div
          className="p-1 hover:bg-violet-100 cursor-pointer flex justify-between"
          onClick={() => setShowTextArea(!showTextArea)}
        >
          <div>Options</div>
          <div>{showTextArea ? '▲' : '▼'}</div>
        </div>
        <JsonTextArea
          onBlur={onBlur}
          className={clsx('w-full mt-2', { hidden: !showTextArea })}
          error={validationError}
        />
      </div>
    </div>
  );
}

export default SelectorWithOptions;
