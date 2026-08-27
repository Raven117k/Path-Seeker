// StatCard — single statistic tile for dashboards / home stat strips.
// Label, value (with optional Counter), optional trend indicator.

import Counter from './Counter';

export default function StatCard({ icon: Icon, label, value, suffix = '', prefix = '', trend, accent = 'indigo', animate = true, decimals = 0 }) {
  const accentClass = `stat-card stat-card--${accent}`;
  return (
    <div className={accentClass}>
      {Icon && (
        <div className="stat-card-icon">
          <Icon size={20} />
        </div>
      )}
      <div className="stat-card-body">
        {typeof value === 'number' && animate ? (
          <strong className="stat-card-value">
            {prefix}
            <Counter target={value} suffix={suffix} decimals={decimals} />
          </strong>
        ) : (
          <strong className="stat-card-value">
            {prefix}
            {value}
            {suffix}
          </strong>
        )}
        <small className="stat-card-label">{label}</small>
        {trend && <span className="stat-card-trend">{trend}</span>}
      </div>
    </div>
  );
}
