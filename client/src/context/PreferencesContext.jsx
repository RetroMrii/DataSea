import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

const PreferencesContext = createContext(null);

const STORAGE_KEY = 'datasea_preferences';

const defaultPreferences = {
    backgroundWaves: true,
    interfaceMotion: true,
    tableDensity: 'comfortable',
    confirmReportName: true,
    defaultReportCategory: 'other',
};

function readStoredPreferences() {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
        return defaultPreferences;
    }

    try {
        const parsedValue = JSON.parse(storedValue);

        return {
            ...defaultPreferences,
            ...parsedValue,
        };
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return defaultPreferences;
    }
}

export function PreferencesProvider({ children }) {
    const [preferences, setPreferences] = useState(readStoredPreferences);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));

        document.documentElement.dataset.waves = preferences.backgroundWaves
            ? 'enabled'
            : 'disabled';

        document.documentElement.dataset.motion = preferences.interfaceMotion
            ? 'enabled'
            : 'reduced';

        document.documentElement.dataset.tableDensity =
            preferences.tableDensity;
    }, [preferences]);

    const updatePreference = useCallback((name, value) => {
        setPreferences((current) => ({
            ...current,
            [name]: value,
        }));
    }, []);

    const resetPreferences = useCallback(() => {
        setPreferences(defaultPreferences);
    }, []);

    const value = useMemo(
        () => ({
            preferences,
            updatePreference,
            resetPreferences,
        }),
        [preferences, updatePreference, resetPreferences]
    );

    return (
        <PreferencesContext.Provider value={value}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);

    if (!context) {
        throw new Error(
            'usePreferences must be used inside PreferencesProvider'
        );
    }

    return context;
}