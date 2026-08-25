export default function DuoToggle({ options, value, onChange }) {
  return (
    <div className="duo-toggle">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`duo-toggle__option ${value === opt.value ? 'is-active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && <opt.icon size={16} strokeWidth={2.5} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}