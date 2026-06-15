import { useEffect, useState } from 'react';

import api from '../services/api.js';

export function useApiHealth() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      try {
        const response = await api.get('/health');

        if (isMounted) {
          setState({
            loading: false,
            error: null,
            data: response.data,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            loading: false,
            error:
              error.response?.data?.message ||
              'Could not connect to the DataSea API.',
            data: null,
          });
        }
      }
    };

    checkHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}