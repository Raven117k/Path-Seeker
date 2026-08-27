// Loader — premium loading spinner with brand colors. Use anywhere we need a brief load.

export default function Loader({ size = 40, label }) {
  return (
    <div className="premium-loader" role="status" aria-live="polite">
      <div
        className="premium-loader-ring"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {label && <span className="premium-loader-label">{label}</span>}
    </div>
  );
}
