import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles, typography, spacing, gradients } from '../styles.jsx';
import { api } from '../api.jsx';

export default function MedicationsScreen({ navigation, route }) {
  const { token } = route.params || {};
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const data = await api.getMedications(token);
      setMedications(data || []);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    setShowAddModal(true);
  };

  const handleScanOption = () => {
    setShowAddModal(false);
    navigation.navigate('Scan', { token });
  };

  const handleManualOption = () => {
    setShowAddModal(false);
    navigation.navigate('MedicineDetails', { medication: {}, token, isNew: true });
  };

  const handleMedicationPress = (medication) => {
    navigation.navigate('MedicineDetails', { medication, token });
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Medications</Text>
        <TouchableOpacity 
          style={styles.addButtonContainer}
          onPress={handleAddMedication}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}
          >
            <Ionicons name="add" size={24} color={colors.primaryForeground} />
            <Text style={styles.addButtonText}>Add Medication</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {medications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="medical-outline" size={64} color={colors.mutedForeground} />
            </View>
            <Text style={styles.emptyStateText}>No medications yet</Text>
            <Text style={styles.emptyStateSubtext}>Scan a package or add manually to get started</Text>
            <TouchableOpacity 
              style={styles.emptyStateButtonContainer}
              onPress={handleAddMedication}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.emptyStateButtonGradient}
              >
                <Ionicons name="add" size={20} color={colors.primaryForeground} style={{ marginRight: 8 }} />
                <Text style={styles.emptyStateButtonText}>Add Medication</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          medications.map((med, index) => (
            <TouchableOpacity
              key={med.id || index}
              style={styles.medicationCard}
              onPress={() => handleMedicationPress(med)}
              activeOpacity={0.7}
            >
              <View style={styles.medicationHeader}>
                <View style={styles.medicationIconContainer}>
                  <Ionicons name="medical" size={24} color={colors.primary} />
                </View>
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{med.name || 'Unknown Medication'}</Text>
                  <Text style={styles.medicationDosage}>{med.dosage || 'N/A'}</Text>
                </View>
                {med.needsRefill && (
                  <View style={styles.refillBadge}>
                    <Text style={styles.refillBadgeText}>Refill</Text>
                  </View>
                )}
              </View>
              <View style={styles.medicationFooter}>
                <View style={styles.medicationFooterItem}>
                  <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
                  <Text style={styles.medicationSchedule}>
                    {med.schedule || 'No schedule set'}
                  </Text>
                </View>
                <Text style={styles.medicationStock}>
                  {med.stock ? `${med.stock} remaining` : 'Stock unknown'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Add Medication Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Medication</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>Choose how you want to add medication</Text>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleScanOption}
              activeOpacity={0.8}
            >
              <View style={styles.modalOptionIconContainer}>
                <Ionicons name="scan" size={32} color={colors.primary} />
              </View>
              <View style={styles.modalOptionTextContainer}>
                <Text style={styles.modalOptionTitle}>Scan Barcode</Text>
                <Text style={styles.modalOptionSubtitle}>Scan medication package barcode</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleManualOption}
              activeOpacity={0.8}
            >
              <View style={styles.modalOptionIconContainer}>
                <Ionicons name="create-outline" size={32} color={colors.primary} />
              </View>
              <View style={styles.modalOptionTextContainer}>
                <Text style={styles.modalOptionTitle}>Add Manually</Text>
                <Text style={styles.modalOptionSubtitle}>Enter medication details manually</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: typography.fontWeightBold,
    color: colors.foreground,
    marginBottom: 16,
  },
  addButtonContainer: {
    borderRadius: spacing.radiusLg,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateText: {
    fontSize: typography.textXl,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: typography.textBase,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  emptyStateButtonContainer: {
    borderRadius: spacing.radiusLg,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  emptyStateButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
  },
  medicationCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: typography.textLg,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: typography.textSm,
    color: colors.mutedForeground,
  },
  refillBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: spacing.radiusSm,
  },
  refillBadgeText: {
    fontSize: typography.textXs,
    fontWeight: typography.fontWeightSemibold,
    color: colors.warning,
  },
  medicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  medicationFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationSchedule: {
    fontSize: typography.textSm,
    color: colors.foreground,
    fontWeight: typography.fontWeightMedium,
  },
  medicationStock: {
    fontSize: typography.textSm,
    color: colors.mutedForeground,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: spacing.radiusXl,
    borderTopRightRadius: spacing.radiusXl,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: typography.textXl,
    fontWeight: typography.fontWeightBold,
    color: colors.foreground,
  },
  modalSubtitle: {
    fontSize: typography.textSm,
    color: colors.mutedForeground,
    marginBottom: 24,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: spacing.radiusLg,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalOptionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modalOptionTextContainer: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
    marginBottom: 4,
  },
  modalOptionSubtitle: {
    fontSize: typography.textSm,
    color: colors.mutedForeground,
  },
});
