// useCountUp — animates a numeric value from 0 to `target` over `duration` ms.
// Triggers when the element first enters the viewport.

import { useEffect, useRef, useState } from 'react';
import useReveal from '../hooks/useReveal';

export default function Counter({
  target = 0,
  duration = 1600,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
  threshold = 0.4
}) {
  const [ref, visible] = useReveal({ threshold, once: true });
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!visible || startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);

  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
