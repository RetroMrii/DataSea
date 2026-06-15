const allowedExtensions = ['csv', 'json', 'xlsx'];
const maxSizeMb = 20;
const maxSizeBytes = maxSizeMb * 1024 * 1024;

function getFileExtension(fileName) {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

function FileUploadBox({ selectedFile, onFileSelect, error }) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const extension = getFileExtension(file.name);

    if (!allowedExtensions.includes(extension)) {
      onFileSelect(null, 'Only CSV, JSON, and XLSX files are supported.');
      return;
    }

    if (file.size > maxSizeBytes) {
      onFileSelect(null, `File must be smaller than ${maxSizeMb}MB.`);
      return;
    }

    onFileSelect(file, '');
  };

  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/70 p-8">
      <label
        htmlFor="dataset"
        className="flex cursor-pointer flex-col items-center justify-center text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-400/10 text-2xl text-sky-300">
          ↑
        </div>

        <h2 className="mt-5 text-xl font-semibold text-white">
          Upload a structured data file
        </h2>

        <p className="mt-2 max-w-md text-sm text-slate-400">
          Choose a CSV, JSON, or XLSX file. DataSea will parse it and generate
          summary statistics, insights, and preview tables.
        </p>

        <span className="mt-6 rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-300">
          Choose file
        </span>

        <input
          id="dataset"
          name="dataset"
          type="file"
          accept=".csv,.json,.xlsx"
          onChange={handleFileChange}
          className="sr-only"
        />
      </label>

      {selectedFile && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-medium text-white">{selectedFile.name}</p>
          <p className="mt-1 text-xs text-slate-400">
            {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}

export default FileUploadBox;