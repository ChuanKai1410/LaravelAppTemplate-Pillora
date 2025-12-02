import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles, typography, spacing, gradients, getGradientColors } from '../styles.jsx';
import { api } from '../api.jsx';
import NotificationService from '../services/NotificationService.jsx';

export default function AddEditReminderScreen({ navigation, route }) {
  const { token, reminder, medications } = route.params || {};
  const isEditMode = !!reminder;

  const [loading, setLoading] = useState(false);
  const [medicationsList, setMedicationsList] = useState(medications || []);
  const [selectedMedication, setSelectedMedication] = useState(reminder?.medicationId || null);
  const [time, setTime] = useState(
    reminder?.time 
      ? new Date(`2000-01-01T${reminder.time}`)
      : new Date()
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [frequency, setFrequency] = useState(reminder?.frequency || 'daily');
  const [daysOfWeek, setDaysOfWeek] = useState(reminder?.daysOfWeek || []);
  const [enabled, setEnabled] = useState(reminder?.enabled !== false);

  useEffect(() => {
    if (!medicationsList.length) {
      loadMedications();
    }
  }, []);

  const loadMedications = async () => {
    try {
      const data = await api.getMedications(token);
      setMedicationsList(data || []);
    } catch (e) {
      console.error('Error loading medications:', e);
    }
  };

  const handleSave = async () => {
    if (frequency === 'weekly' && daysOfWeek.length === 0) {
      Alert.alert('Required', 'Please select at least one day for weekly reminders');
      return;
    }

    setLoading(true);
    try {
      const timeString = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
      const reminderData = {
        medication_id: selectedMedication || null,
        time: timeString,
        frequency: frequency,
        enabled: enabled,
        days_of_week: frequency === 'weekly' ? daysOfWeek : null,
      };

      let savedReminder;
      if (isEditMode) {
        savedReminder = await api.updateReminder(token, reminder.id, reminderData);
      } else {
        savedReminder = await api.createReminder(token, reminderData);
      }

      // Update notifications
      if (savedReminder.enabled) {
        await NotificationService.scheduleReminder(savedReminder);
      } else {
        await NotificationService.cancelReminder(savedReminder.id);
      }

      Alert.alert(
        'Success',
        isEditMode ? 'Reminder updated successfully' : 'Reminder created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await NotificationService.cancelReminder(reminder.id);
              await api.deleteReminder(token, reminder.id);
              Alert.alert('Success', 'Reminder deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (e) {
              Alert.alert('Error', e.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const toggleDay = (day) => {
    setDaysOfWeek(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Edit Reminder' : 'New Reminder'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Medication Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Medication (Optional)</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.medicationScroll}
          >
            <TouchableOpacity
              style={[
                styles.medicationChip,
                selectedMedication === null && styles.medicationChipSelected,
              ]}
              onPress={() => setSelectedMedication(null)}
            >
              <Text
                style={[
                  styles.medicationChipText,
                  selectedMedication === null && styles.medicationChipTextSelected,
                ]}
              >
                General Reminder
              </Text>
            </TouchableOpacity>
            {medicationsList.map((med) => (
              <TouchableOpacity
                key={med.id}
                style={[
                  styles.medicationChip,
                  selectedMedication === med.id && styles.medicationChipSelected,
                ]}
                onPress={() => setSelectedMedication(med.id)}
              >
                <Text
                  style={[
                    styles.medicationChipText,
                    selectedMedication === med.id && styles.medicationChipTextSelected,
                  ]}
                >
                  {med.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {medicationsList.length === 0 && (
            <Text style={styles.helpText}>No medications available. You can create a general reminder.</Text>
          )}
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Time *</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <Text style={styles.timeText}>
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <>
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  if (Platform.OS === 'android') {
                    setShowTimePicker(false);
                  }
                  if (selectedTime) {
                    setTime(selectedTime);
                  }
                }}
              />
              {Platform.OS === 'ios' && (
                <View style={styles.timePickerActions}>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={styles.timePickerButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        {/* Frequency Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Frequency *</Text>
          <View style={styles.frequencyContainer}>
            {['daily', 'twice_daily', 'weekly'].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  frequency === freq && styles.frequencyButtonSelected,
                ]}
                onPress={() => setFrequency(freq)}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    frequency === freq && styles.frequencyButtonTextSelected,
                  ]}
                >
                  {freq.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Days of Week (for weekly) */}
        {frequency === 'weekly' && (
          <View style={styles.section}>
            <Text style={styles.label}>Days of Week *</Text>
            <View style={styles.daysContainer}>
              {days.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    daysOfWeek.includes(index) && styles.dayButtonSelected,
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      daysOfWeek.includes(index) && styles.dayButtonTextSelected,
                    ]}
                  >
                    {day.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Enabled Toggle */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Enable Reminder</Text>
            <TouchableOpacity
              style={[styles.switch, enabled && styles.switchEnabled]}
              onPress={() => setEnabled(!enabled)}
            >
              <View style={[styles.switchThumb, enabled && styles.switchThumbEnabled]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButtonContainer}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={getGradientColors('primary')}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color={colors.primaryForeground} style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>
                  {isEditMode ? 'Update Reminder' : 'Create Reminder'}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Delete Button (Edit mode only) */}
        {isEditMode && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={20} color={colors.destructive} style={{ marginRight: 8 }} />
            <Text style={styles.deleteButtonText}>Delete Reminder</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    color: colors.foreground,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: typography.textSm,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
    marginBottom: 12,
  },
  medicationScroll: {
    marginBottom: 8,
  },
  medicationChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 8,
  },
  medicationChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  medicationChipText: {
    fontSize: typography.textSm,
    fontWeight: typography.fontWeightMedium,
    color: colors.foreground,
  },
  medicationChipTextSelected: {
    color: colors.primaryForeground,
  },
  helpText: {
    fontSize: typography.textSm,
    color: colors.mutedForeground,
    fontStyle: 'italic',
    marginTop: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeText: {
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
    marginLeft: 12,
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  frequencyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  frequencyButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  frequencyButtonText: {
    fontSize: typography.textSm,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
  },
  frequencyButtonTextSelected: {
    color: colors.primaryForeground,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayButtonText: {
    fontSize: typography.textXs,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
  },
  dayButtonTextSelected: {
    color: colors.primaryForeground,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchEnabled: {
    backgroundColor: colors.primary,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  switchThumbEnabled: {
    alignSelf: 'flex-end',
  },
  saveButtonContainer: {
    borderRadius: spacing.radiusLg,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  saveButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderRadius: spacing.radiusLg,
    borderWidth: 2,
    borderColor: colors.destructive,
  },
  deleteButtonText: {
    color: colors.destructive,
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
  },
  timePickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
  },
  timePickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusMd,
  },
  timePickerButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
  },
});

