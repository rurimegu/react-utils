import { useState, useCallback } from 'react';
import { Registry } from '../../utils/registry';

export function useControlPanelRegistry(registry: Registry) {
  const [type, setType] = useState(registry.keys().next().value as string);
  const [options, setOptions] = useState<object>({});
  const onTypeChange = useCallback((val: string) => setType(val), [setType]);

  const onOptionsChange = useCallback(
    (val: object) => setOptions(val),
    [setOptions],
  );
  return {
    type,
    options,
    onTypeChange,
    onOptionsChange,
  };
}
