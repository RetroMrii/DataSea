function EmptyState({
  title = 'Nothing here yet',
  description = 'Once data is available, it will appear here.',
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-8 text-center">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export default EmptyState;