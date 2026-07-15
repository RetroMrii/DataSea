import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import api from '../services/api.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'datasea_token';
const USER_KEY = 'datasea_user';

function readStoredUser() {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function extractUserFromMeResponse(responseData) {
  return (
    responseData?.data?.user ||
    responseData?.data ||
    responseData?.user ||
    null
  );
}

function extractUserFromAuthResponse(responseData) {
  return responseData?.data?.user || responseData?.user || null;
}

function extractTokenFromAuthResponse(responseData) {
  return responseData?.data?.token || responseData?.token || null;
}

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [accountDeleteLoading, setAccountDeleteLoading] =
    useState(false);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const saveSession = useCallback((userData, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        const currentUser = extractUserFromMeResponse(
          response.data
        );

        if (!currentUser) {
          clearSession();
          return;
        }

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(currentUser)
        );

        setUser(currentUser);
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [clearSession]);

  const login = useCallback(
    async ({ email, password }) => {
      setAuthError(null);

      try {
        const response = await api.post('/auth/login', {
          email,
          password,
        });

        const token = extractTokenFromAuthResponse(
          response.data
        );

        const userData = extractUserFromAuthResponse(
          response.data
        );

        if (!token || !userData) {
          throw new Error(
            'Login response is missing token or user data.'
          );
        }

        saveSession(userData, token);

        return {
          user: userData,
          token,
        };
      } catch (error) {
        const message = getErrorMessage(
          error,
          'Login failed. Please try again.'
        );

        setAuthError(message);
        throw new Error(message);
      }
    },
    [saveSession]
  );

  const register = useCallback(
    async ({ name, email, password }) => {
      setAuthError(null);

      try {
        const response = await api.post('/auth/register', {
          name,
          email,
          password,
        });

        const token = extractTokenFromAuthResponse(
          response.data
        );

        const userData = extractUserFromAuthResponse(
          response.data
        );

        if (!token || !userData) {
          throw new Error(
            'Register response is missing token or user data.'
          );
        }

        saveSession(userData, token);

        return {
          user: userData,
          token,
        };
      } catch (error) {
        const message = getErrorMessage(
          error,
          'Registration failed. Please try again.'
        );

        setAuthError(message);
        throw new Error(message);
      }
    },
    [saveSession]
  );

  const deleteAccount = useCallback(
    async ({ name, password }) => {
      setAuthError(null);
      setAccountDeleteLoading(true);

      try {
        const response = await api.delete('/auth/account', {
          data: {
            name,
            password,
          },
        });

        clearSession();

        return response.data?.data || {};
      } catch (error) {
        const message = getErrorMessage(
          error,
          'Could not delete the account.'
        );

        setAuthError(message);
        throw new Error(message);
      } finally {
        setAccountDeleteLoading(false);
      }
    },
    [clearSession]
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      accountDeleteLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      deleteAccount,
      clearAuthError,
    }),
    [
      user,
      loading,
      authError,
      accountDeleteLoading,
      login,
      register,
      logout,
      deleteAccount,
      clearAuthError,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}