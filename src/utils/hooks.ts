import { MeguEvent } from '@rurino/core';
import { useEffect, useMemo, useRef } from 'react';

type MeguEventPair<T> = [MeguEvent<T>, MeguEvent<T>];

export function useRatioEnter(ratio: number): MeguEventPair<number> {
  const prevWithin = useRef<boolean>(false);
  const events = useMemo<MeguEventPair<number>>(
    () => [new MeguEvent<number>(), new MeguEvent<number>()],
    [],
  );
  useEffect(() => {
    const within = ratio >= 0 && ratio <= 1;
    if (prevWithin.current !== within) {
      if (within) events[0].emit(ratio);
      else events[1].emit(ratio);
      prevWithin.current = within;
    }
  }, [ratio, events]);
  return events;
}

export function mergeRefs<T>(...refs: React.Ref<T>[]): React.Ref<T> {
  return (value) => {
    for (const ref of refs) {
      if (ref) {
        if (typeof ref === 'function') ref(value);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        else (ref as any).current = value;
      }
    }
  };
}
