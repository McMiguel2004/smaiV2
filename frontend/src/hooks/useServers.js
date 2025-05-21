import { useState, useEffect } from 'react';
import { serverService } from '../services/serverService';

export const useServers = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServers = async () => {
    setLoading(true);
    try {
      const data = await serverService.fetchServers();
      setServers(data.servers || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  return {
    servers,
    loading,
    error,
    refreshServers: fetchServers,
    setServers,
    setError
  };
};