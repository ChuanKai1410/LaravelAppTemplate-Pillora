import { api } from '../api.jsx';

/**
 * Dashboard Model
 * Handles dashboard data operations
 */
export class DashboardModel {
  /**
   * Get dashboard data
   */
  static async getDashboard(token) {
    try {
      const [userData, dashboardData] = await Promise.all([
        api.me(token),
        api.getDashboard(token).catch(() => null),
      ]);
      
      return {
        user: userData,
        dashboard: dashboardData || {
          upcomingDoses: [],
          alerts: [],
          adherenceRate: 0,
          takenDoses: 0,
          missedDoses: 0,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard data: ${error.message}`);
    }
  }
}

