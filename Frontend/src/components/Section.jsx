// Section — shared section wrapper with consistent padding + reveal.
// Use everywhere instead of repeating `className="user-page"` inline styles.

import Reveal from './Reveal';

export default function Section({ title, kicker, description, actions, children, className = '', id, padded = true }) {
  return (
    <section id={id} className={`app-section${padded ? ' app-section--padded' : ''} ${className}`.trim()}>
      {(title || description || actions) && (
        <Reveal variant="slide-up" once>
          <div className="app-section-head">
            <div>
              {kicker && <div className="app-section-kicker">{kicker}</div>}
              {title && <h2 className="app-section-title">{title}</h2>}
              {description && <p className="app-section-description">{description}</p>}
            </div>
            {actions && <div className="app-section-actions">{actions}</div>}
          </div>
        </Reveal>
      )}
      {children}
    </section>
  );
}
