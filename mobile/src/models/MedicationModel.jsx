import { api } from '../api.jsx';

/**
 * Medication Model
 * Handles all medication-related data operations
 */
export class MedicationModel {
  /**
   * Get all medications for the user
   */
  static async getAll(token) {
    try {
      return await api.getMedications(token);
    } catch (error) {
      throw new Error(`Failed to fetch medications: ${error.message}`);
    }
  }

  /**
   * Get a single medication by ID
   */
  static async getById(token, id) {
    try {
      const medications = await api.getMedications(token);
      return medications.find(med => med.id === id);
    } catch (error) {
      throw new Error(`Failed to fetch medication: ${error.message}`);
    }
  }

  /**
   * Add a new medication
   */
  static async create(token, medicationData) {
    try {
      return await api.addMedication(token, medicationData);
    } catch (error) {
      throw new Error(`Failed to add medication: ${error.message}`);
    }
  }

  /**
   * Update an existing medication
   */
  static async update(token, id, medicationData) {
    try {
      return await api.updateMedication(token, id, medicationData);
    } catch (error) {
      throw new Error(`Failed to update medication: ${error.message}`);
    }
  }

  /**
   * Delete a medication
   */
  static async delete(token, id) {
    try {
      return await api.deleteMedication(token, id);
    } catch (error) {
      throw new Error(`Failed to delete medication: ${error.message}`);
    }
  }

  /**
   * Scan medication barcode
   */
  static async scan(token, barcodeData) {
    try {
      return await api.scanMedication(token, barcodeData);
    } catch (error) {
      throw new Error(`Failed to scan medication: ${error.message}`);
    }
  }
}

