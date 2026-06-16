const variants = {
  neutral: 'border-slate-700 bg-slate-900 text-slate-300',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  danger: 'border-red-500/30 bg-red-500/10 text-red-300',
};

function StatusBadge({ children, variant = 'neutral' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        variants[variant] || variants.neutral
      }`}
    >
      {children}
    </span>
  );
}

export default StatusBadge;