import { useState, useEffect } from 'react';
import { AnalyticsModel } from '../models/AnalyticsModel.jsx';

/**
 * Analytics Controller
 * Manages business logic for Analytics screen
 */
export function useAnalyticsController(token) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      loadAnalytics();
    }
  }, [token]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsModel.getAnalytics(token);
      setAnalytics(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadAnalytics();
  };

  return {
    analytics,
    loading,
    error,
    refresh,
  };
}

