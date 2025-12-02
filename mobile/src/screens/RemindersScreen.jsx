import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles, gradients, getGradientColors, spacing, typography } from '../styles.jsx';
import { api } from '../api.jsx';
import NotificationService from '../services/NotificationService.jsx';

export default function RemindersScreen({ navigation, route }) {
  const { token } = route.params || {};
  const [reminders, setReminders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalEnabled, setGlobalEnabled] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadReminders();
      loadMedications();
    }, [])
  );

  useEffect(() => {
    initializeNotifications();
  }, []);

  useEffect(() => {
    // Schedule notifications whenever reminders change
    if (reminders.length > 0 && globalEnabled) {
      scheduleAllReminders();
    }
  }, [reminders, globalEnabled]);

  const initializeNotifications = async () => {
    try {
      const { status } = await NotificationService.requestPermissions();
      if (status !== 'granted') {
        Alert.alert(
          'Notification Permission',
          'Please enable notifications to receive medication reminders.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const scheduleAllReminders = async () => {
    if (!globalEnabled) {
      await NotificationService.cancelAllNotifications();
      return;
    }

    try {
      const enabledReminders = reminders.filter(r => r.enabled !== false);
      await NotificationService.scheduleReminders(enabledReminders);
    } catch (error) {
      console.error('Error scheduling reminders:', error);
    }
  };

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await api.getReminders(token);
      const remindersList = data?.reminders || data || [];
      setReminders(remindersList);
      setGlobalEnabled(data?.globalEnabled !== false);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMedications = async () => {
    try {
      const data = await api.getMedications(token);
      setMedications(data || []);
    } catch (e) {
      console.error('Error loading medications:', e);
    }
  };

  const handleAddReminder = () => {
    navigation.navigate('AddEditReminder', { token, medications });
  };

  const handleEditReminder = (reminder) => {
    navigation.navigate('AddEditReminder', { token, reminder, medications });
  };

  const handleDeleteReminder = async (reminderId) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await NotificationService.cancelReminder(reminderId);
              await api.deleteReminder(token, reminderId);
              await loadReminders();
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ]
    );
  };

  const toggleReminder = async (reminderId, enabled) => {
    try {
      await api.updateReminder(token, reminderId, { enabled });
      const updatedReminders = reminders.map(r => 
        r.id === reminderId ? { ...r, enabled } : r
      );
      setReminders(updatedReminders);
      
      // Update notification for this reminder
      const reminder = updatedReminders.find(r => r.id === reminderId);
      if (reminder) {
        if (enabled) {
          await NotificationService.scheduleReminder(reminder);
        } else {
          await NotificationService.cancelReminder(reminderId);
        }
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const toggleGlobal = async (enabled) => {
    try {
      await api.updateReminderSettings(token, { globalEnabled: enabled });
      setGlobalEnabled(enabled);
      
      // Cancel or schedule all reminders based on global setting
      if (enabled) {
        const enabledReminders = reminders.filter(r => r.enabled !== false);
        await NotificationService.scheduleReminders(enabledReminders);
      } else {
        await NotificationService.cancelAllNotifications();
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Reminders</Text>
          <Text style={styles.headerSubtitle}>Manage your medication notifications</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Enable Reminders</Text>
              <Text style={styles.settingSubtitle}>Turn on/off all medication reminders</Text>
            </View>
            <Switch
              value={globalEnabled}
              onValueChange={toggleGlobal}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medication Reminders</Text>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={handleAddReminder}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={getGradientColors('primary')}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={20} color={colors.primaryForeground} style={{ marginRight: 6 }} />
                <Text style={styles.addButtonText}>Add</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {reminders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No reminders set</Text>
              <Text style={styles.emptyStateSubtext}>Tap "Add" to create a new reminder</Text>
            </View>
          ) : (
            reminders.map((reminder, index) => (
              <TouchableOpacity
                key={reminder.id || index}
                style={styles.card}
                onPress={() => handleEditReminder(reminder)}
                activeOpacity={0.7}
              >
                <View style={styles.reminderHeader}>
                  <View style={styles.reminderInfo}>
                    <Text style={styles.reminderName}>{reminder.medicationName || 'Unknown'}</Text>
                    <Text style={styles.reminderTime}>{reminder.time || 'No time set'}</Text>
                    {reminder.frequency && (
                      <Text style={styles.reminderFrequency}>
                        {reminder.frequency.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                    )}
                  </View>
                  <View style={styles.reminderActions}>
                    <Switch
                      value={reminder.enabled !== false}
                      onValueChange={(enabled) => toggleReminder(reminder.id, enabled)}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      onTouchEnd={(e) => e.stopPropagation()}
                    />
                    <TouchableOpacity
                      style={styles.deleteIconButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteReminder(reminder.id);
                      }}
                    >
                      <Ionicons name="trash-outline" size={20} color={colors.destructive} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  section: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  addButtonContainer: {
    borderRadius: spacing.radiusMd,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.textSm,
    fontWeight: typography.fontWeightSemibold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteIconButton: {
    marginLeft: 12,
    padding: 4,
  },
  reminderInfo: {
    flex: 1,
    marginRight: 16,
  },
  reminderName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  reminderFrequency: {
    fontSize: 12,
    color: colors.textLight,
  },
});

