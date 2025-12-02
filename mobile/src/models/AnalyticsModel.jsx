import { api } from '../api.jsx';

/**
 * Analytics Model
 * Handles analytics data operations
 */
export class AnalyticsModel {
  /**
   * Get analytics data
   */
  static async getAnalytics(token) {
    try {
      const data = await api.getAnalytics(token);
      return {
        adherenceRate: data?.adherenceRate || 0,
        totalDoses: data?.totalDoses || 0,
        missedDoses: data?.missedDoses || 0,
        takenDoses: data?.takenDoses || 0,
        weeklyData: data?.weeklyData || [],
        medicationBreakdown: data?.medicationBreakdown || [],
      };
    } catch (error) {
      throw new Error(`Failed to fetch analytics: ${error.message}`);
    }
  }
}

