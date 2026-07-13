function PageHeader({ eyebrow, title, description, action }) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-6">
      <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_28rem)]" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              {eyebrow}
            </p>
          )}

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>

          {description && (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </section>
  );
}

export default PageHeader;