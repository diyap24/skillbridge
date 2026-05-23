import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (ref.current) { clearInterval(ref.current); ref.current = null; }
    const step     = target / 40;
    const interval = duration / 40;
    let current    = 0;

    ref.current = setInterval(() => {
      current += step;
      if (current >= target) {
        clearInterval(ref.current!);
        ref.current = null;
        setValue(target);
      } else {
        setValue(Math.floor(current));
      }
    }, interval);

    return () => { if (ref.current) { clearInterval(ref.current); ref.current = null; } };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}
