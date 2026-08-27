// Reveal — wraps children with a scroll-triggered reveal animation.
// Uses useReveal hook. Variants: fade, slide-up, slide-left, slide-right, zoom, flip.

import useReveal from '../hooks/useReveal';

const VARIANTS = {
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  'slide-up': { from: { opacity: 0, transform: 'translateY(32px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
  'slide-left': { from: { opacity: 0, transform: 'translateX(-32px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
  'slide-right': { from: { opacity: 0, transform: 'translateX(32px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
  zoom: { from: { opacity: 0, transform: 'scale(0.92)' }, to: { opacity: 1, transform: 'scale(1)' } },
  flip: { from: { opacity: 0, transform: 'rotateX(-12deg)' }, to: { opacity: 1, transform: 'rotateX(0)' } }
};

export default function Reveal({
  children,
  variant = 'slide-up',
  delay = 0,
  duration = 700,
  as: Tag = 'div',
  className = '',
  style = {},
  threshold,
  once = true
}) {
  const [ref, visible] = useReveal({ threshold, once });
  const v = VARIANTS[variant] || VARIANTS['slide-up'];

  // Respect prefers-reduced-motion: skip animation, just show content
  const reduced =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finalStyle = reduced
    ? { ...style }
    : {
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? v.to.transform || 'none' : v.from.transform || 'translateY(0)',
        transition: `opacity ${duration}ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
        willChange: 'opacity, transform'
      };

  return (
    <Tag ref={ref} className={className} style={finalStyle}>
      {children}
    </Tag>
  );
}
