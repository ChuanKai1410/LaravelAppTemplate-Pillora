import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles, typography, spacing, gradients } from '../styles.jsx';
import { api } from '../api.jsx';

export default function ScanScreen({ navigation, route }) {
  const { token } = route.params || {};
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scannedMedication, setScannedMedication] = useState(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick image: ' + e.message);
    }
  };

  const takePhoto = async () => {
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to take photos');
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to take photo: ' + e.message);
    }
  };

  const processImage = async (imageUri) => {
    setScanning(true);
    setSelectedImage(imageUri);
    setScannedMedication(null);

    try {
      // Create form data to send image
      const formData = new FormData();
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: imageUri,
        type: type,
        name: filename || 'medication.jpg',
      });

      // Call API to scan medication from image
      const medication = await api.scanMedicationImage(token, formData);
      setScannedMedication(medication);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to process image');
      setScannedMedication({
        name: 'Unknown Medication',
        notFound: true,
      });
    } finally {
      setScanning(false);
    }
  };

  const handleDiscard = () => {
    setSelectedImage(null);
    setScannedMedication(null);
  };

  const handleAddToList = () => {
    if (scannedMedication) {
      navigation.navigate('MedicineDetails', {
        medication: scannedMedication,
        token,
        isNew: true,
      });
    }
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Scan Medication</Text>
            <Text style={styles.headerSubtitle}>Take a photo or select an image</Text>
          </View>
        </View>

        {!selectedImage ? (
          <View style={styles.cameraPlaceholder}>
            <View style={styles.placeholderIconContainer}>
              <Ionicons name="camera-outline" size={80} color={colors.mutedForeground} />
            </View>
            <Text style={styles.placeholderText}>No image selected</Text>
            <Text style={styles.placeholderSubtext}>
              Take a photo of your medication or select one from your gallery
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButtonContainer}
                onPress={takePhoto}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.actionButtonGradient}
                >
                  <Ionicons name="camera" size={24} color={colors.primaryForeground} style={styles.buttonIcon} />
                  <Text style={styles.actionButtonText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pickButton}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <Ionicons name="images-outline" size={24} color={colors.primary} />
                <Text style={styles.pickButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} resizeMode="contain" />
            
            {scanning && (
              <View style={styles.scanningOverlay}>
                <ActivityIndicator size="large" color={colors.primaryForeground} />
                <Text style={styles.scanningText}>Analyzing medication...</Text>
              </View>
            )}

            {!scanning && (
              <View style={styles.imageActions}>
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={handleDiscard}
                  activeOpacity={0.8}
                >
                  <Ionicons name="refresh" size={20} color={colors.primary} />
                  <Text style={styles.retakeButtonText}>Retake</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Scanned Medication Result */}
        {scannedMedication && !scanning && (
          <View style={styles.resultContainer}>
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons
                  name={scannedMedication.notFound ? 'alert-circle' : 'checkmark-circle'}
                  size={32}
                  color={scannedMedication.notFound ? colors.warning : colors.success}
                />
                <Text style={styles.resultTitle}>
                  {scannedMedication.notFound ? 'Medication Not Identified' : 'Medication Identified'}
                </Text>
              </View>
              
              {scannedMedication.name && (
                <Text style={styles.resultName}>{scannedMedication.name}</Text>
              )}

              {scannedMedication.dosage && (
                <View style={styles.resultInfo}>
                  <Text style={styles.resultInfoLabel}>Dosage:</Text>
                  <Text style={styles.resultInfoValue}>{scannedMedication.dosage}</Text>
                </View>
              )}

              {scannedMedication.instructions && (
                <View style={styles.resultInfo}>
                  <Text style={styles.resultInfoLabel}>Instructions:</Text>
                  <Text style={styles.resultInfoValue}>{scannedMedication.instructions}</Text>
                </View>
              )}

              <View style={styles.resultButtons}>
                <TouchableOpacity
                  style={styles.discardButton}
                  onPress={handleDiscard}
                  activeOpacity={0.8}
                >
                  <Ionicons name="close-circle" size={20} color={colors.destructive} style={{ marginRight: 8 }} />
                  <Text style={styles.discardButtonText}>Discard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addButtonContainer}
                  onPress={handleAddToList}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.addButtonGradient}
                  >
                    <Ionicons name="add-circle" size={20} color={colors.primaryForeground} style={{ marginRight: 8 }} />
                    <Text style={styles.addButtonText}>Add to Medications</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: typography.fontWeightBold,
    color: colors.foreground,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: typography.textSm,
    color: colors.mutedForeground,
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minHeight: 400,
  },
  placeholderIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: typography.textXl,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: typography.textBase,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  actionButtons: {
    width: '100%',
    paddingHorizontal: 24,
  },
  actionButtonContainer: {
    borderRadius: spacing.radiusLg,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  actionButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
    marginLeft: 8,
  },
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: spacing.radiusLg,
    paddingVertical: 16,
  },
  pickButtonText: {
    color: colors.primary,
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  imageContainer: {
    flex: 1,
    padding: 24,
    minHeight: 400,
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: spacing.radiusLg,
    backgroundColor: colors.background,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    bottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: spacing.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningText: {
    color: colors.primaryForeground,
    fontSize: typography.textBase,
    marginTop: 16,
    fontWeight: typography.fontWeightMedium,
  },
  imageActions: {
    marginTop: 16,
    alignItems: 'center',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  retakeButtonText: {
    color: colors.primary,
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
    marginLeft: 8,
  },
  resultContainer: {
    padding: 24,
    paddingTop: 0,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: typography.textLg,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
    marginLeft: 12,
  },
  resultName: {
    fontSize: typography.textXl,
    fontWeight: typography.fontWeightBold,
    color: colors.foreground,
    marginBottom: 16,
  },
  resultInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  resultInfoLabel: {
    fontSize: typography.textSm,
    fontWeight: typography.fontWeightSemibold,
    color: colors.mutedForeground,
    marginRight: 8,
  },
  resultInfoValue: {
    fontSize: typography.textSm,
    color: colors.foreground,
    flex: 1,
  },
  resultButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  discardButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.destructive,
    borderRadius: spacing.radiusLg,
    paddingVertical: 14,
    marginRight: 12,
  },
  discardButtonText: {
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
    color: colors.destructive,
  },
  addButtonContainer: {
    flex: 2,
    borderRadius: spacing.radiusLg,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  addButtonText: {
    color: colors.primaryForeground,
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
  },
});
