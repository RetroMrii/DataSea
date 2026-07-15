import { useRef, useState } from 'react';

import formatFileSize from '../../utils/formatFileSize.js';

const allowedExtensions = ['csv', 'json', 'xlsx'];
const maxSizeMb = 20;
const maxSizeBytes = maxSizeMb * 1024 * 1024;

function getFileExtension(fileName) {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

function validateFile(file) {
  if (!file) {
    return 'Choose a file to continue.';
  }

  const extension = getFileExtension(file.name);

  if (!allowedExtensions.includes(extension)) {
    return 'Only CSV, JSON, and XLSX files are supported.';
  }

  if (file.size > maxSizeBytes) {
    return `File must be smaller than ${maxSizeMb} MB.`;
  }

  return '';
}

function FileUploadBox({
  selectedFile,
  onFileSelect,
  error,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const processFile = (file) => {
    const validationError = validateFile(file);

    if (validationError) {
      onFileSelect(null, validationError);
      return;
    }

    onFileSelect(file, '');
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      processFile(file);
    }

    event.target.value = '';
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget === event.target) {
      setDragActive(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (disabled) {
      return;
    }

    const file = event.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  const handleRemove = () => {
    if (disabled) {
      return;
    }

    onFileSelect(null, '');

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const extension = selectedFile
    ? getFileExtension(selectedFile.name).toUpperCase()
    : '';

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 shadow-xl shadow-slate-950/20 backdrop-blur">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative m-3 rounded-[1.25rem] border-2 border-dashed px-5 py-10 text-center transition sm:px-8 sm:py-12 ${dragActive
          ? 'border-sky-400 bg-sky-500/10'
          : selectedFile
            ? 'border-emerald-400/30 bg-emerald-500/5'
            : 'border-slate-700 bg-slate-900/35 hover:border-sky-400/50 hover:bg-sky-500/5'
          } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      >
        <input
          ref={inputRef}
          id="dataset"
          name="dataset"
          type="file"
          accept=".csv,.json,.xlsx"
          onChange={handleFileChange}
          disabled={disabled}
          className="sr-only"
        />

        <div
          aria-hidden="true"
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-semibold transition ${dragActive
            ? 'border-sky-400/40 bg-sky-500/20 text-sky-200'
            : selectedFile
              ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200'
              : 'border-sky-400/20 bg-sky-500/10 text-sky-300'
            }`}
        >
          {selectedFile ? '✓' : '↑'}
        </div>

        <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">
          {dragActive
            ? 'Drop the file here'
            : selectedFile
              ? 'Dataset selected'
              : 'Upload a structured dataset'}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
          {selectedFile
            ? 'Review the selected file, then start the analysis.'
            : 'Drag and drop a file here, or select one from your computer.'}
        </p>

        {!selectedFile && (
          <label
            htmlFor="dataset"
            className={`mt-6 inline-flex rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-300 ${disabled ? 'pointer-events-none' : 'cursor-pointer'
              }`}
          >
            Choose file
          </label>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {allowedExtensions.map((type) => (
            <span
              key={type}
              className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300"
            >
              {type}
            </span>
          ))}

          <span className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs text-slate-400">
            Maximum {maxSizeMb} MB
          </span>
        </div>
      </div>

      {selectedFile && (
        <div className="border-t border-slate-800 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-500/15 text-xs font-bold text-emerald-200">
                {extension || 'FILE'}
              </div>

              <div className="min-w-0">
                <p
                  className="truncate text-sm font-semibold text-white"
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="border-t border-red-500/20 bg-red-500/5 px-5 py-4 sm:px-6">
          <p role="alert" className="text-sm text-red-200">
            {error}
          </p>
        </div>
      )}
    </section>
  );
}

export default FileUploadBox;