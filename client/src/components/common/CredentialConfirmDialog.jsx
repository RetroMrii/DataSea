import { useEffect, useRef, useState } from 'react';

function CredentialConfirmDialog({
    open,
    title,
    description,
    expectedName,
    confirmLabel,
    loading = false,
    error = '',
    onCancel,
    onConfirm,
}) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (!open) {
            setName('');
            setPassword('');
            return;
        }

        const timeoutId = window.setTimeout(() => {
            nameInputRef.current?.focus();
        }, 0);

        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !loading) {
                onCancel?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.clearTimeout(timeoutId);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, loading, onCancel]);

    if (!open) {
        return null;
    }

    const cleanName = name.trim();
    const expectedCleanName = String(expectedName || '').trim();

    const nameMatches =
        cleanName.length > 0 &&
        cleanName.toLowerCase() === expectedCleanName.toLowerCase();

    const canSubmit =
        nameMatches &&
        password.length > 0 &&
        !loading;

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!canSubmit) {
            return;
        }

        onConfirm({
            name: cleanName,
            password,
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-md"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) {
                    onCancel?.();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="credential-dialog-title"
                aria-describedby="credential-dialog-description"
                className="w-full max-w-lg overflow-hidden rounded-3xl border border-red-500/25 bg-slate-950 shadow-2xl shadow-black/60"
            >
                <div className="border-b border-red-500/20 bg-red-500/10 px-6 py-5">
                    <div className="flex items-start gap-4">
                        <div
                            aria-hidden="true"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/15 text-lg font-bold text-red-200"
                        >
                            !
                        </div>

                        <div className="min-w-0">
                            <h2
                                id="credential-dialog-title"
                                className="text-xl font-bold tracking-tight text-white"
                            >
                                {title}
                            </h2>

                            <p
                                id="credential-dialog-description"
                                className="mt-2 text-sm leading-6 text-slate-400"
                            >
                                {description}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-6 py-5">
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-300">
                                Required account name
                            </p>

                            <p className="mt-2 break-words text-sm font-semibold text-red-100">
                                {expectedCleanName || 'Unavailable'}
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmationName"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Type your account name
                            </label>

                            <input
                                ref={nameInputRef}
                                id="confirmationName"
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                disabled={loading}
                                autoComplete="off"
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                                placeholder={expectedCleanName}
                            />

                            {cleanName.length > 0 && !nameMatches && (
                                <p className="mt-2 text-sm text-red-300">
                                    The account name does not match.
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmationPassword"
                                className="mb-2 block text-sm font-medium text-slate-200"
                            >
                                Current password
                            </label>

                            <input
                                id="confirmationPassword"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                disabled={loading}
                                autoComplete="current-password"
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                                placeholder="Enter your current password"
                            />
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                            >
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-800 px-6 py-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Confirming...' : confirmLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CredentialConfirmDialog;