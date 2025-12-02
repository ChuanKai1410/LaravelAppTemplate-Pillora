import { api } from '../api.jsx';

/**
 * Reminder Model
 * Handles reminder data operations
 */
export class ReminderModel {
  /**
   * Get all reminders
   */
  static async getAll(token) {
    try {
      const data = await api.getReminders(token);
      return {
        reminders: data?.reminders || data || [],
        globalEnabled: data?.globalEnabled !== false,
      };
    } catch (error) {
      throw new Error(`Failed to fetch reminders: ${error.message}`);
    }
  }

  /**
   * Update a reminder
   */
  static async update(token, id, reminderData) {
    try {
      return await api.updateReminder(token, id, reminderData);
    } catch (error) {
      throw new Error(`Failed to update reminder: ${error.message}`);
    }
  }

  /**
   * Create a new reminder
   */
  static async create(token, reminderData) {
    try {
      return await api.createReminder(token, reminderData);
    } catch (error) {
      throw new Error(`Failed to create reminder: ${error.message}`);
    }
  }

  /**
   * Delete a reminder
   */
  static async delete(token, id) {
    try {
      return await api.deleteReminder(token, id);
    } catch (error) {
      throw new Error(`Failed to delete reminder: ${error.message}`);
    }
  }

  /**
   * Update reminder settings
   */
  static async updateSettings(token, settings) {
    try {
      return await api.updateReminderSettings(token, settings);
    } catch (error) {
      throw new Error(`Failed to update reminder settings: ${error.message}`);
    }
  }
}

