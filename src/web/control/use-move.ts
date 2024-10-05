import { useEffect, useRef, useState } from 'react';
import { Clamp01 } from '@rurino/core';

export interface UseMovePosition {
  x: number;
  y: number;
}

export function clampUseMovePosition(position: UseMovePosition) {
  return {
    x: Clamp01(position.x),
    y: Clamp01(position.y),
  };
}

export function useMove<T extends HTMLElement = HTMLDivElement>(
  onChange: (value: UseMovePosition) => void,
) {
  const ref = useRef<T>(null);
  const mounted = useRef<boolean>(false);
  const isSliding = useRef(false);
  const frame = useRef(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    mounted.current = true;
  }, []);

  useEffect(() => {
    const onScrub = ({ x, y }: UseMovePosition) => {
      cancelAnimationFrame(frame.current);

      frame.current = requestAnimationFrame(() => {
        if (mounted.current && ref.current) {
          ref.current.style.userSelect = 'none';
          const rect = ref.current.getBoundingClientRect();

          if (rect.width && rect.height) {
            const _x = Clamp01((x - rect.left) / rect.width);
            onChange({
              x: _x,
              y: Clamp01((y - rect.top) / rect.height),
            });
          }
        }
      });
    };

    const bindEvents = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', stopScrubbing);
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', stopScrubbing);
    };

    const unbindEvents = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopScrubbing);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', stopScrubbing);
    };

    const startScrubbing = () => {
      if (!isSliding.current && mounted.current) {
        isSliding.current = true;
        setActive(true);
        bindEvents();
      }
    };

    const stopScrubbing = () => {
      if (isSliding.current && mounted.current) {
        isSliding.current = false;
        setActive(false);
        unbindEvents();
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      startScrubbing();
      event.preventDefault();
      onMouseMove(event);
    };

    const onMouseMove = (event: MouseEvent) =>
      onScrub({ x: event.clientX, y: event.clientY });

    const onTouchStart = (event: TouchEvent) => {
      if (event.cancelable) {
        event.preventDefault();
      }

      startScrubbing();
      onTouchMove(event);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.cancelable) {
        event.preventDefault();
      }

      onScrub({
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      });
    };

    const currentRef = ref.current;
    currentRef?.addEventListener('mousedown', onMouseDown);
    currentRef?.addEventListener('touchstart', onTouchStart, {
      passive: false,
    });

    return () => {
      currentRef?.removeEventListener('mousedown', onMouseDown);
      currentRef?.removeEventListener('touchstart', onTouchStart);
    };
  }, [onChange]);

  return { ref, active };
}
