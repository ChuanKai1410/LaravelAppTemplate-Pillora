import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '../styles.jsx';
import { api } from '../api.jsx';

export default function MedicineDetailsScreen({ navigation, route }) {
  const { medication, token, isNew } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: medication?.name || '',
    dosage: medication?.dosage || '',
    schedule: medication?.schedule || '',
    stock: medication?.stock?.toString() || '',
    notes: medication?.notes || '',
  });

  const handleSave = async () => {
    if (!formData.name) {
      Alert.alert('Required', 'Please enter medication name');
      return;
    }

    try {
      setLoading(true);
      if (isNew) {
        await api.addMedication(token, formData);
        Alert.alert('Success', 'Medication added successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await api.updateMedication(token, medication.id, formData);
        Alert.alert('Success', 'Medication updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefill = () => {
    navigation.navigate('NewOrders', { token, medication });
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{isNew ? 'Add Medication' : 'Medication Details'}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Medication Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter medication name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Dosage</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 500mg, 1 tablet"
            value={formData.dosage}
            onChangeText={(text) => setFormData({ ...formData, dosage: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Schedule</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Twice daily, Every 8 hours"
            value={formData.schedule}
            onChangeText={(text) => setFormData({ ...formData, schedule: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Stock Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of doses remaining"
            value={formData.stock}
            onChangeText={(text) => setFormData({ ...formData, stock: text })}
            keyboardType="numeric"
            editable={!loading}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional notes or instructions"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>

        {medication?.sideEffects && (
          <View style={styles.card}>
            <Text style={styles.label}>Side Effects</Text>
            <Text style={styles.infoText}>{medication.sideEffects}</Text>
          </View>
        )}

        {medication?.warnings && (
          <View style={styles.card}>
            <Text style={styles.label}>Warnings</Text>
            <Text style={styles.infoText}>{medication.warnings}</Text>
          </View>
        )}

        {medication?.interactions && (
          <View style={styles.card}>
            <Text style={styles.label}>Drug Interactions</Text>
            <Text style={styles.infoText}>{medication.interactions}</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          {!isNew && (
            <TouchableOpacity
              style={[styles.button, styles.refillButton]}
              onPress={handleRefill}
              disabled={loading}
            >
              <Text style={styles.refillButtonText}>Order Refill</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>{isNew ? 'Add Medication' : 'Save Changes'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    padding: 24,
  },
  card: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refillButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  refillButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.accent,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

