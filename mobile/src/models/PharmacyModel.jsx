import { api } from '../api.jsx';

/**
 * Pharmacy Model
 * Handles pharmacy data operations
 */
export class PharmacyModel {
  /**
   * Get all pharmacies
   */
  static async getAll(token) {
    try {
      return await api.getPharmacies(token);
    } catch (error) {
      throw new Error(`Failed to fetch pharmacies: ${error.message}`);
    }
  }
}

