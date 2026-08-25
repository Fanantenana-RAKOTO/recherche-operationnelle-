export default function DuoButton({ children, icon: Icon, variant = 'primary', ...props }) {
  return (
    <button className={`duo-button duo-button--${variant}`} {...props}>
      {Icon && <Icon size={18} strokeWidth={2.5} />}
      {children}
    </button>
  );
}