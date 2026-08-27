// Marquee — CSS-animated infinite horizontal scroll for stat strips / trust lines.
// Duplicates content for seamless loop. Pauses on hover.

import './Marquee.css';

export default function Marquee({ children, speed = 40, pauseOnHover = true, className = '', style = {} }) {
  return (
    <div
      className={`marquee${pauseOnHover ? ' marquee--pause-on-hover' : ''} ${className}`.trim()}
      style={{ '--marquee-duration': `${speed}s`, ...style }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        <div className="marquee-content">{children}</div>
        <div className="marquee-content">{children}</div>
      </div>
    </div>
  );
}
