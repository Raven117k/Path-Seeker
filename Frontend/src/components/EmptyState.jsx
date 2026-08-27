// EmptyState — shared empty-list placeholder with icon + heading + hint.

export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty-state glass-panel">
      {Icon && (
        <div className="empty-state-icon" aria-hidden="true">
          <Icon size={32} />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-message">{message}</p>}
      {action}
    </div>
  );
}
