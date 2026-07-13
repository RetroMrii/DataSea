function EmptyState({
  title = 'Nothing here yet',
  description = 'Once data is available, it will appear here.',
  action,
  icon = '—',
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 p-8 text-center shadow-xl shadow-slate-950/20 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.1),transparent_24rem)]" />

      <div className="relative">
        <div
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/80 text-2xl text-slate-400 shadow-inner shadow-slate-950/40"
        >
          {icon}
        </div>

        <h2 className="mt-5 text-lg font-semibold tracking-tight text-white">
          {title}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
          {description}
        </p>

        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}

export default EmptyState;