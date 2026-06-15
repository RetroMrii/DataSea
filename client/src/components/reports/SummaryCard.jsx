function SummaryCard({ label, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      {description && <p className="mt-2 text-xs text-slate-500">{description}</p>}
    </div>
  );
}

export default SummaryCard;