import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, commonStyles, gradients } from '../styles.jsx';

export default function WelcomeScreen({ navigation }) {
  const handleGetStarted = () => {
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="medical" size={80} color={colors.primary} />
        </View>
        <Text style={styles.title}>Welcome to Pillora</Text>
        <Text style={styles.subtitle}>
          Your personal medication management assistant
        </Text>
      </View>

      <View style={styles.features}>
        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Ionicons name="scan" size={32} color={colors.primary} />
          </View>
          <Text style={styles.featureTitle}>Scan Medications</Text>
          <Text style={styles.featureText}>
            Quickly add medications by scanning barcodes
          </Text>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Ionicons name="notifications" size={32} color={colors.primary} />
          </View>
          <Text style={styles.featureTitle}>Smart Reminders</Text>
          <Text style={styles.featureText}>
            Never miss a dose with personalized reminders
          </Text>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Ionicons name="analytics" size={32} color={colors.primary} />
          </View>
          <Text style={styles.featureTitle}>Track Progress</Text>
          <Text style={styles.featureText}>
            Monitor your medication adherence and health
          </Text>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Ionicons name="storefront" size={32} color={colors.primary} />
          </View>
          <Text style={styles.featureTitle}>Order Online</Text>
          <Text style={styles.featureText}>
            Easily order medications from nearby pharmacies
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.getStartedButtonContainer}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.getStartedButtonGradient}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.primaryForeground} style={styles.arrowIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: typography.fontWeightBold,
    color: colors.foreground,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.textBase,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  features: {
    flex: 1,
    paddingVertical: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: spacing.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureTitle: {
    fontSize: typography.textLg,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
    marginBottom: 4,
    flex: 1,
  },
  featureText: {
    fontSize: typography.textSm,
    color: colors.mutedForeground,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    paddingBottom: 40,
  },
  getStartedButtonContainer: {
    borderRadius: spacing.radiusLg,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  getStartedButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  getStartedText: {
    color: colors.primaryForeground,
    fontSize: typography.textLg,
    fontWeight: typography.fontWeightSemibold,
    marginRight: 4,
  },
  arrowIcon: {
    marginLeft: 4,
  },
});

