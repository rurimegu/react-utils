import { useState, useCallback } from 'react';
import { Registry } from '../../utils/registry';

export function useControlPanelRegistry(registry: Registry) {
  const [type, setType] = useState(registry.keys().next().value as string);
  const [config, setConfig] = useState({});
  const onTypeChange = useCallback((val: string) => setType(val), [setType]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const onConfigChange = useCallback((val: any) => setConfig(val), [setConfig]);
  return {
    type,
    config,
    onTypeChange,
    onConfigChange,
  };
}
