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
