import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '../styles.jsx';
import { api } from '../api.jsx';

export default function NewOrdersScreen({ navigation, route }) {
  const { token, medication, pharmacy } = route.params || {};
  const [medications, setMedications] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState(medication ? [medication.id] : []);
  const [selectedPharmacy, setSelectedPharmacy] = useState(pharmacy || null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [medsData, pharmData] = await Promise.all([
        api.getMedications(token),
        pharmacy ? Promise.resolve(null) : api.getPharmacies(token),
      ]);
      setMedications(medsData || []);
      if (pharmData && pharmData.length > 0) {
        setSelectedPharmacy(pharmData[0]);
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMedication = (medId) => {
    setSelectedMedications(prev =>
      prev.includes(medId)
        ? prev.filter(id => id !== medId)
        : [...prev, medId]
    );
  };

  const handlePlaceOrder = async () => {
    if (selectedMedications.length === 0) {
      Alert.alert('Required', 'Please select at least one medication');
      return;
    }
    if (!selectedPharmacy) {
      Alert.alert('Required', 'Please select a pharmacy');
      return;
    }

    try {
      setSubmitting(true);
      const order = await api.createOrder(token, {
        medicationIds: selectedMedications,
        pharmacyId: selectedPharmacy.id,
      });
      Alert.alert('Success', 'Order placed successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Payment', { token, order }) },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
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
        <Text style={styles.headerTitle}>New Order</Text>
        <Text style={styles.headerSubtitle}>Order medications from pharmacy</Text>
      </View>

      <View style={styles.content}>
        {/* Pharmacy Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Pharmacy</Text>
          {selectedPharmacy ? (
            <View style={styles.card}>
              <Text style={styles.pharmacyName}>{selectedPharmacy.name}</Text>
              <Text style={styles.pharmacyAddress}>{selectedPharmacy.address}</Text>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => navigation.navigate('Pharmacies', { token })}
              >
                <Text style={styles.changeButtonText}>Change Pharmacy</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => navigation.navigate('Pharmacies', { token })}
            >
              <Text style={styles.selectButtonText}>Select Pharmacy</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Medication Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Medications</Text>
          {medications.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No medications available</Text>
              <Text style={styles.emptyStateSubtext}>Add medications to your list first</Text>
            </View>
          ) : (
            medications.map((med) => (
              <TouchableOpacity
                key={med.id}
                style={[
                  styles.medicationItem,
                  selectedMedications.includes(med.id) && styles.medicationItemSelected,
                ]}
                onPress={() => toggleMedication(med.id)}
              >
                <View style={styles.medicationItemContent}>
                  <Text style={styles.medicationItemName}>{med.name}</Text>
                  <Text style={styles.medicationItemDosage}>{med.dosage}</Text>
                </View>
                {selectedMedications.includes(med.id) && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          style={[styles.orderButton, submitting && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={submitting || selectedMedications.length === 0 || !selectedPharmacy}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.orderButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  pharmacyAddress: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  changeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },
  changeButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  selectButton: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  selectButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
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
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  medicationItemSelected: {
    borderColor: colors.accent,
    backgroundColor: '#f0f7ff',
  },
  medicationItemContent: {
    flex: 1,
  },
  medicationItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  medicationItemDosage: {
    fontSize: 14,
    color: colors.textLight,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  orderButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  orderButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

