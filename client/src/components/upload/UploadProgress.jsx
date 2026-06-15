function UploadProgress({ progress = 0 }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-white">Uploading and analyzing</span>
        <span className="text-slate-400">{progress}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-sky-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default UploadProgress;