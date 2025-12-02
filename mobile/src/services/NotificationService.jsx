import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Notification Service
 * Handles all medication reminder notifications
 */
class NotificationService {
  /**
   * Request notification permissions
   */
  async requestPermissions() {
    if (!Device.isDevice) {
      console.warn('Notifications only work on physical devices');
      return { status: 'denied' };
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return { status: 'denied' };
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medication-reminders', {
        name: 'Medication Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0ea5e9',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });
    }

    return { status: finalStatus };
  }

  /**
   * Schedule a medication reminder notification
   * @param {Object} reminder - Reminder object with id, medicationName, time, frequency, daysOfWeek
   */
  async scheduleReminder(reminder) {
    try {
      // Cancel any existing notifications for this reminder
      await this.cancelReminder(reminder.id);

      if (!reminder.enabled) {
        return;
      }

      const [hours, minutes] = reminder.time.split(':').map(Number);
      
      // Parse days of week if weekly
      let daysOfWeek = null;
      if (reminder.frequency === 'weekly' && reminder.daysOfWeek) {
        daysOfWeek = Array.isArray(reminder.daysOfWeek) 
          ? reminder.daysOfWeek 
          : JSON.parse(reminder.daysOfWeek || '[]');
      }

      let notificationIds = [];

      if (reminder.frequency === 'daily') {
        // Schedule daily notification
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Time to take your medication',
            body: `${reminder.medicationName || 'Medication'} - ${reminder.time}`,
            data: {
              reminderId: reminder.id,
              medicationName: reminder.medicationName,
              type: 'medication-reminder',
            },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            hour: hours,
            minute: minutes,
            repeats: true,
            channelId: 'medication-reminders',
          },
        });
        notificationIds.push(notificationId);
      } else if (reminder.frequency === 'twice_daily') {
        // Schedule twice daily (morning and evening)
        const morningTime = hours < 12 ? hours : hours - 12;
        const eveningTime = hours >= 12 ? hours : hours + 12;

        const morningId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Time to take your medication',
            body: `${reminder.medicationName || 'Medication'} - Morning Dose`,
            data: {
              reminderId: reminder.id,
              medicationName: reminder.medicationName,
              type: 'medication-reminder',
            },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            hour: morningTime,
            minute: minutes,
            repeats: true,
            channelId: 'medication-reminders',
          },
        });

        const eveningId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Time to take your medication',
            body: `${reminder.medicationName || 'Medication'} - Evening Dose`,
            data: {
              reminderId: reminder.id,
              medicationName: reminder.medicationName,
              type: 'medication-reminder',
            },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            hour: eveningTime,
            minute: minutes,
            repeats: true,
            channelId: 'medication-reminders',
          },
        });

        notificationIds.push(morningId, eveningId);
      } else if (reminder.frequency === 'weekly' && daysOfWeek && daysOfWeek.length > 0) {
        // Schedule weekly notifications for specific days
        for (const day of daysOfWeek) {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Time to take your medication',
              body: `${reminder.medicationName || 'Medication'} - ${reminder.time}`,
              data: {
                reminderId: reminder.id,
                medicationName: reminder.medicationName,
                type: 'medication-reminder',
              },
              sound: true,
              priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
              weekday: day + 1, // 1 = Sunday, 2 = Monday, etc.
              hour: hours,
              minute: minutes,
              repeats: true,
              channelId: 'medication-reminders',
            },
          });
          notificationIds.push(notificationId);
        }
      }

      // Store notification IDs for this reminder
      if (notificationIds.length > 0) {
        await this.storeNotificationIds(reminder.id, notificationIds);
      }

      return notificationIds;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      throw error;
    }
  }

  /**
   * Cancel all notifications for a reminder
   */
  async cancelReminder(reminderId) {
    try {
      const notificationIds = await this.getNotificationIds(reminderId);
      if (notificationIds && notificationIds.length > 0) {
        for (const id of notificationIds) {
          await Notifications.cancelScheduledNotificationAsync(id);
        }
        await this.removeNotificationIds(reminderId);
      }
    } catch (error) {
      console.error('Error canceling reminder:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await this.clearStoredNotificationIds();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Store notification IDs for a reminder
   */
  async storeNotificationIds(reminderId, notificationIds) {
    try {
      const key = `reminder_${reminderId}_notifications`;
      await AsyncStorage.setItem(key, JSON.stringify(notificationIds));
    } catch (error) {
      console.error('Error storing notification IDs:', error);
    }
  }

  /**
   * Get stored notification IDs for a reminder
   */
  async getNotificationIds(reminderId) {
    try {
      const key = `reminder_${reminderId}_notifications`;
      const stored = await AsyncStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting notification IDs:', error);
      return null;
    }
  }

  /**
   * Remove stored notification IDs for a reminder
   */
  async removeNotificationIds(reminderId) {
    try {
      const key = `reminder_${reminderId}_notifications`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing notification IDs:', error);
    }
  }

  /**
   * Clear all stored notification IDs
   */
  async clearStoredNotificationIds() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const reminderKeys = keys.filter(key => key.startsWith('reminder_') && key.endsWith('_notifications'));
      if (reminderKeys.length > 0) {
        await AsyncStorage.multiRemove(reminderKeys);
      }
    } catch (error) {
      console.error('Error clearing stored notification IDs:', error);
    }
  }

  /**
   * Schedule reminders from a list
   */
  async scheduleReminders(reminders) {
    if (!Array.isArray(reminders)) {
      return;
    }

    // Cancel all existing reminders first
    await this.cancelAllNotifications();

    // Schedule all enabled reminders
    for (const reminder of reminders) {
      if (reminder.enabled) {
        try {
          await this.scheduleReminder(reminder);
        } catch (error) {
          console.error(`Error scheduling reminder ${reminder.id}:`, error);
        }
      }
    }
  }
}

// Export singleton instance
export default new NotificationService();

