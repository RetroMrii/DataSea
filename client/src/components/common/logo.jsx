const Logo = ({
    size = 42,
    showText = false,
    className = '',
    textClassName = '',
}) => {
    return (
        <div className={`inline-flex items-center gap-3 ${className}`} aria-label="DataSea logo">
            <svg
                width={size}
                height={size}
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden={!showText}
            >
                <defs>
                    <linearGradient id="datasea-wave-gradient" x1="8" y1="14" x2="56" y2="50">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>

                    <linearGradient id="datasea-wave-soft" x1="10" y1="18" x2="54" y2="46">
                        <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.85" />
                    </linearGradient>
                </defs>

                <rect
                    x="6"
                    y="6"
                    width="52"
                    height="52"
                    rx="16"
                    fill="#020617"
                    stroke="#1e3a8a"
                    strokeOpacity="0.45"
                />

                <path
                    d="M19 29C23.5 24 29 24 33.5 29C38 34 43.5 34 48 29"
                    stroke="url(#datasea-wave-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                <path
                    d="M19 37C23.5 32 29 32 33.5 37C38 42 43.5 42 48 37"
                    stroke="url(#datasea-wave-soft)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.9"
                />

                <circle cx="21" cy="25" r="1.6" fill="#bae6fd" opacity="0.9" />
                <circle cx="45" cy="41" r="1.6" fill="#93c5fd" opacity="0.8" />
            </svg>

            {showText && (
                <span
                    className={`text-lg font-semibold tracking-tight text-slate-100 ${textClassName}`}
                >
                    DataSea
                </span>
            )}
        </div>
    );
};

export default Logo;