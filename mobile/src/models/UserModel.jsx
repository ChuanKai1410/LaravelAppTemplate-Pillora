import { api } from '../api.jsx';

/**
 * User Model
 * Handles user data operations
 */
export class UserModel {
  /**
   * Get current user
   */
  static async getCurrent(token) {
    try {
      return await api.me(token);
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  /**
   * Logout user
   */
  static async logout(token) {
    try {
      return await api.logout(token);
    } catch (error) {
      throw new Error(`Failed to logout: ${error.message}`);
    }
  }
}

