import { useState, useEffect } from 'react';
import { UserModel } from '../models/UserModel.jsx';

/**
 * Profile Controller
 * Manages business logic for Profile screen
 */
export function useProfileController(token) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserModel.getCurrent(token);
      setUser(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await UserModel.logout(token);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  const refresh = () => {
    loadUser();
  };

  return {
    user,
    loading,
    error,
    logout,
    refresh,
  };
}

