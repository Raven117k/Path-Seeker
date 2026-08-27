import React from 'react';

export default function PageLoader({ label = 'Loading' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="skeleton-loader" aria-hidden="true">
        <span className="skeleton skeleton-loader-title" />
        <span className="skeleton skeleton-loader-line" />
        <span className="skeleton skeleton-loader-line skeleton-loader-line--short" />
        <div className="skeleton-loader-grid">
          <span className="skeleton skeleton-loader-card" />
          <span className="skeleton skeleton-loader-card" />
          <span className="skeleton skeleton-loader-card" />
        </div>
      </div>
    </div>
  );
}
