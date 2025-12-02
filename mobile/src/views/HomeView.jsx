import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles, typography, spacing, gradients } from '../styles.jsx';

/**
 * Home View
 * UI component for Home screen
 */
export default function HomeView({
  user,
  dashboard,
  loading,
  onScanPress,
  onMedicationsPress,
  onRemindersPress,
  onPharmaciesPress,
  onAnalyticsPress,
}) {
  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const upcomingDoses = dashboard?.upcomingDoses || [];
  const alerts = dashboard?.alerts || [];

  return (
    <ScrollView style={commonStyles.container}>
      {/* User Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* 1. Adherence Summary */}
        {dashboard?.adherenceRate !== undefined && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.cardTitle}>Adherence Summary</Text>
              </View>
            </View>
            <View style={styles.adherenceSummary}>
              <View style={styles.adherenceCircle}>
                <Text style={styles.adherencePercentage}>{dashboard.adherenceRate}%</Text>
                <Text style={styles.adherenceLabel}>Adherence</Text>
              </View>
              <View style={styles.adherenceStats}>
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: colors.success + '20' }]}>
                    <Ionicons name="checkmark" size={20} color={colors.success} />
                  </View>
                  <Text style={styles.statValue}>{dashboard.takenDoses || 0}</Text>
                  <Text style={styles.statLabel}>Taken</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: colors.destructive + '20' }]}>
                    <Ionicons name="close" size={20} color={colors.destructive} />
                  </View>
                  <Text style={styles.statValue}>{dashboard.missedDoses || 0}</Text>
                  <Text style={styles.statLabel}>Missed</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 2. Upcoming Doses */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="time" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Upcoming Doses</Text>
            </View>
            <TouchableOpacity onPress={onMedicationsPress}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingDoses.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.mutedForeground} />
              <Text style={styles.emptyText}>No upcoming doses</Text>
            </View>
          ) : (
            upcomingDoses.slice(0, 3).map((dose, index) => (
              <View key={index} style={styles.doseItem}>
                <View style={styles.doseIconContainer}>
                  <Ionicons name="medical" size={20} color={colors.primary} />
                </View>
                <View style={styles.doseInfo}>
                  <Text style={styles.doseName}>{dose.medicationName}</Text>
                  <View style={styles.doseTimeContainer}>
                    <Ionicons name="time-outline" size={14} color={colors.mutedForeground} style={{ marginRight: 4 }} />
                    <Text style={styles.doseTime}>{dose.time}</Text>
                  </View>
                </View>
                <View style={styles.doseBadge}>
                  <Text style={styles.doseBadgeText}>{dose.dosage}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* 3. Features (Quick Actions Grid) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="apps" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Features</Text>
            </View>
          </View>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={onScanPress}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIconContainer, { backgroundColor: colors.secondary }]}>
                <Ionicons name="scan" size={28} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Scan</Text>
              <Text style={styles.quickActionSubtext}>Medication</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={onRemindersPress}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIconContainer, { backgroundColor: colors.secondary }]}>
                <Ionicons name="notifications" size={28} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Reminders</Text>
              <Text style={styles.quickActionSubtext}>Alerts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={onPharmaciesPress}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIconContainer, { backgroundColor: colors.secondary }]}>
                <Ionicons name="location" size={28} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Pharmacies</Text>
              <Text style={styles.quickActionSubtext}>Nearby</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={onAnalyticsPress}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIconContainer, { backgroundColor: colors.secondary }]}>
                <Ionicons name="stats-chart" size={28} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Analytics</Text>
              <Text style={styles.quickActionSubtext}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. View Analytics Button */}
        <TouchableOpacity
          style={styles.analyticsCard}
          onPress={onAnalyticsPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.analyticsGradient}
          >
            <View style={styles.analyticsContent}>
              <View style={styles.analyticsIconContainer}>
                <Ionicons name="stats-chart" size={32} color={colors.primaryForeground} />
              </View>
              <View style={styles.analyticsTextContainer}>
                <Text style={styles.analyticsTitle}>View Analytics</Text>
                <Text style={styles.analyticsSubtitle}>Track your medication adherence</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.primaryForeground} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Alerts */}
        {alerts.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="notifications" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.cardTitle}>Alerts</Text>
              </View>
            </View>
            {alerts.map((alert, index) => (
              <View key={index} style={styles.alertItem}>
                <View style={[
                  styles.alertIconContainer,
                  alert.type === 'warning' && { backgroundColor: colors.warning + '20' }
                ]}>
                  <Ionicons 
                    name={alert.type === 'warning' ? 'warning' : 'information-circle'} 
                    size={20} 
                    color={alert.type === 'warning' ? colors.warning : colors.info} 
                  />
                </View>
                <Text style={styles.alertText}>{alert.message}</Text>
              </View>
            ))}
          </View>
        )}
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
    backgroundColor: '#bae6fd', // Darker blue than background
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: typography.textSm,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: typography.fontWeightBold,
    color: colors.foreground,
  },
  content: {
    padding: 24,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: typography.textLg,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
  },
  seeAllText: {
    fontSize: typography.textSm,
    fontWeight: typography.fontWeightSemibold,
    color: colors.primary,
  },
  adherenceSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adherenceCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
  },
  adherencePercentage: {
    fontSize: 28,
    fontWeight: typography.fontWeightBold,
    color: colors.primary,
  },
  adherenceLabel: {
    fontSize: typography.textXs,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  adherenceStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: typography.fontWeightBold,
    color: colors.foreground,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: typography.textXs,
    color: colors.mutedForeground,
    fontWeight: typography.fontWeightMedium,
  },
  doseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  doseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  doseInfo: {
    flex: 1,
  },
  doseName: {
    fontSize: typography.textBase,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
    marginBottom: 4,
  },
  doseTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  doseTime: {
    fontSize: typography.textSm,
    color: colors.mutedForeground,
  },
  doseBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: spacing.radiusSm,
  },
  doseBadgeText: {
    color: colors.primaryForeground,
    fontSize: typography.textXs,
    fontWeight: typography.fontWeightSemibold,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: spacing.radiusMd,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: typography.textSm,
    fontWeight: typography.fontWeightSemibold,
    color: colors.foreground,
    marginBottom: 2,
  },
  quickActionSubtext: {
    fontSize: typography.textXs,
    color: colors.mutedForeground,
  },
  analyticsCard: {
    marginBottom: 24,
    borderRadius: spacing.radiusLg,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  analyticsGradient: {
    padding: 20,
  },
  analyticsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyticsIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryForeground + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  analyticsTextContainer: {
    flex: 1,
  },
  analyticsTitle: {
    fontSize: typography.textLg,
    fontWeight: typography.fontWeightSemibold,
    color: colors.primaryForeground,
    marginBottom: 4,
  },
  analyticsSubtitle: {
    fontSize: typography.textSm,
    color: colors.primaryForeground + 'CC',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  alertIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.info + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: typography.textSm,
    color: colors.foreground,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: typography.textSm,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 12,
  },
});
