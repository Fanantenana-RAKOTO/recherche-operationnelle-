export default function DuoCard({ title, children, className = '' }) {
  return (
    <div className={`duo-card ${className}`}>
      {title && <h3 className="duo-card__title">{title}</h3>}
      {children}
    </div>
  );
}