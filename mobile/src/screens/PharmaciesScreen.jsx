import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles, gradients, getGradientColors } from '../styles.jsx';
import { api } from '../api.jsx';

export default function PharmaciesScreen({ navigation, route }) {
  const { token } = route.params || {};
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPharmacies();
  }, []);

  const loadPharmacies = async () => {
    try {
      setLoading(true);
      const data = await api.getPharmacies(token);
      setPharmacies(data || []);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePharmacyPress = (pharmacy) => {
    navigation.navigate('NewOrders', { token, pharmacy });
  };

  const openInteractiveMap = () => {
    // Open Google Maps to search for nearby pharmacies
    const searchQuery = 'pharmacy near me';
    const url = Platform.select({
      ios: `maps://maps.apple.com/?q=${encodeURIComponent(searchQuery)}`,
      android: `geo:0,0?q=${encodeURIComponent(searchQuery)}`,
    });

    const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

    Linking.canOpenURL(url || webUrl)
      .then((supported) => {
        if (supported && url) {
          return Linking.openURL(url);
        } else {
          return Linking.openURL(webUrl);
        }
      })
      .catch((err) => {
        console.error('Error opening maps:', err);
        Alert.alert('Error', 'Unable to open maps. Please check your device settings.');
      });
  };

  const openMaps = (pharmacy) => {
    const { latitude, longitude, address, name } = pharmacy;
    
    if (!latitude || !longitude) {
      Alert.alert('Error', 'Location information not available for this pharmacy');
      return;
    }

    const url = Platform.select({
      ios: `maps://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`,
      android: `google.navigation:q=${latitude},${longitude}`,
    });

    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    Linking.canOpenURL(url || webUrl)
      .then((supported) => {
        if (supported && url) {
          return Linking.openURL(url);
        } else {
          return Linking.openURL(webUrl);
        }
      })
      .catch((err) => {
        console.error('Error opening maps:', err);
        Alert.alert('Error', 'Unable to open maps. Please check your device settings.');
      });
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Nearby Pharmacies</Text>
          <Text style={styles.headerSubtitle}>Find pharmacies in your area</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Interactive Map View Card */}
        <View style={styles.mapCard}>
          <View style={styles.mapCardContent}>
            <View style={styles.mapIconContainer}>
              <Ionicons name="map" size={32} color={colors.primary} />
            </View>
            <View style={styles.mapCardText}>
              <Text style={styles.mapCardTitle}>Interactive Map View</Text>
              <Text style={styles.mapCardSubtitle}>Find nearby pharmacies on the map</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.mapButtonContainer}
            onPress={openInteractiveMap}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={getGradientColors('primary')}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mapButtonGradient}
            >
              <Ionicons name="map-outline" size={20} color={colors.primaryForeground} style={{ marginRight: 8 }} />
              <Text style={styles.mapButtonText}>Open Map</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {pharmacies.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No pharmacies found</Text>
            <Text style={styles.emptyStateSubtext}>Try enabling location services</Text>
          </View>
        ) : (
          pharmacies.map((pharmacy, index) => (
            <TouchableOpacity
              key={pharmacy.id || index}
              style={styles.pharmacyCard}
              onPress={() => handlePharmacyPress(pharmacy)}
              activeOpacity={0.7}
            >
              <View style={styles.pharmacyHeader}>
                <View style={styles.pharmacyInfo}>
                  <Text style={styles.pharmacyName}>{pharmacy.name || 'Unknown Pharmacy'}</Text>
                  <Text style={styles.pharmacyAddress}>{pharmacy.address || 'Address not available'}</Text>
                </View>
                {pharmacy.distance && (
                  <Text style={styles.pharmacyDistance}>{pharmacy.distance}</Text>
                )}
              </View>
              <View style={styles.pharmacyFooter}>
                <View style={styles.pharmacyStatus}>
                  <View style={[styles.statusDot, pharmacy.open ? styles.statusOpen : styles.statusClosed]} />
                  <Text style={styles.pharmacyStatusText}>
                    {pharmacy.open ? 'Open Now' : 'Closed'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() => openMaps(pharmacy)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="navigate" size={18} color={colors.primary} />
                  <Text style={styles.directionsButtonText}>Directions</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
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
    paddingBottom: 20,
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
    flex: 1,
    padding: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  pharmacyCard: {
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
  pharmacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pharmacyInfo: {
    flex: 1,
    marginRight: 16,
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
    lineHeight: 20,
  },
  pharmacyDistance: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  pharmacyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pharmacyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusOpen: {
    backgroundColor: colors.success,
  },
  statusClosed: {
    backgroundColor: colors.error,
  },
  pharmacyStatusText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  pharmacyPhone: {
    fontSize: 14,
    color: colors.textLight,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  directionsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  mapCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mapCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mapIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  mapCardText: {
    flex: 1,
  },
  mapCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  mapCardSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  mapButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mapButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
});

