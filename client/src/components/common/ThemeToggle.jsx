import { useTheme } from '../../context/ThemeContext.jsx';

function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-sky-400/70 hover:text-white light:border-slate-200 light:bg-white light:text-slate-700 light:hover:border-sky-400 light:hover:text-slate-950"
        >
            <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
        </button>
    );
}

export default ThemeToggle;