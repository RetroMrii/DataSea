const variants = {
  neutral: 'border-slate-700/80 bg-slate-900/80 text-slate-300',
  success: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
  info: 'border-sky-400/30 bg-sky-500/10 text-sky-300',
  danger: 'border-red-400/30 bg-red-500/10 text-red-300',
};

const dots = {
  neutral: 'bg-slate-400',
  success: 'bg-emerald-300',
  warning: 'bg-amber-300',
  info: 'bg-sky-300',
  danger: 'bg-red-300',
};

function StatusBadge({ children, variant = 'neutral', showDot = false }) {
  const safeVariant = variants[variant] ? variant : 'neutral';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${variants[safeVariant]
        }`}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${dots[safeVariant]}`}
        />
      )}

      {children}
    </span>
  );
}

export default StatusBadge;