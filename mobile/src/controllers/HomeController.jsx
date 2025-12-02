import { useState, useEffect } from 'react';
import { DashboardModel } from '../models/DashboardModel.jsx';

/**
 * Home Controller
 * Manages business logic for Home screen
 */
export function useHomeController(token) {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, [token]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DashboardModel.getDashboard(token);
      setUser(data.user);
      setDashboard(data.dashboard);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadDashboard();
  };

  return {
    user,
    dashboard,
    loading,
    error,
    refresh,
  };
}

