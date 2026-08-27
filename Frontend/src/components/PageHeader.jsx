// PageHeader — consistent header for every authenticated page.
// Title, optional kicker, optional description, optional actions slot.

export default function PageHeader({ kicker, title, description, actions, children, className = '' }) {
  return (
    <div className={`page-header ${className}`.trim()}>
      <div className="page-header-text">
        {kicker && <div className="page-kicker">{kicker}</div>}
        {title && <h1 className="page-title">{title}</h1>}
        {description && <p className="page-description">{description}</p>}
        {children}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
