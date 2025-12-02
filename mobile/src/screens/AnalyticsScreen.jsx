import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { colors, commonStyles } from '../styles.jsx';
import { api } from '../api.jsx';

export default function AnalyticsScreen({ route }) {
  const { token } = route.params || {};
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.getAnalytics(token);
      setAnalytics(data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const adherenceRate = analytics?.adherenceRate || 0;
  const totalDoses = analytics?.totalDoses || 0;
  const missedDoses = analytics?.missedDoses || 0;
  const takenDoses = analytics?.takenDoses || 0;

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Track your medication adherence</Text>
      </View>

      <View style={styles.content}>
        {/* Adherence Rate Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Adherence Rate</Text>
          <View style={styles.adherenceContainer}>
            <View style={styles.circleProgress}>
              <Text style={styles.adherencePercentage}>{adherenceRate}%</Text>
            </View>
            <Text style={styles.adherenceLabel}>
              {adherenceRate >= 80 ? 'Excellent' : adherenceRate >= 60 ? 'Good' : 'Needs Improvement'}
            </Text>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <Text style={styles.statValue}>{takenDoses}</Text>
            <Text style={styles.statLabel}>Taken</Text>
          </View>
          <View style={[styles.statCard, styles.statCardWarning]}>
            <Text style={styles.statValue}>{missedDoses}</Text>
            <Text style={styles.statLabel}>Missed</Text>
          </View>
          <View style={[styles.statCard, styles.statCardInfo]}>
            <Text style={styles.statValue}>{totalDoses}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Weekly Trend */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Trend</Text>
          <View style={styles.chartContainer}>
            {analytics?.weeklyData?.map((day, index) => (
              <View key={index} style={styles.chartBar}>
                <View
                  style={[
                    styles.chartBarFill,
                    { height: `${(day.adherence || 0)}%` },
                  ]}
                />
                <Text style={styles.chartLabel}>{day.day}</Text>
              </View>
            )) || (
              <Text style={styles.noDataText}>No data available</Text>
            )}
          </View>
        </View>

        {/* Medication Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>By Medication</Text>
          {analytics?.medicationBreakdown?.map((med, index) => (
            <View key={index} style={styles.breakdownItem}>
              <View style={styles.breakdownHeader}>
                <Text style={styles.breakdownName}>{med.name}</Text>
                <Text style={styles.breakdownRate}>{med.adherence}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${med.adherence}%` },
                  ]}
                />
              </View>
            </View>
          )) || (
            <Text style={styles.noDataText}>No medication data available</Text>
          )}
        </View>

        {/* Insights */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Insights</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              {adherenceRate >= 80
                ? 'Great job! You\'re maintaining excellent medication adherence.'
                : adherenceRate >= 60
                ? 'You\'re doing well, but there\'s room for improvement. Try setting more reminders.'
                : 'Consider setting up medication reminders to improve your adherence rate.'}
            </Text>
          </View>
          {missedDoses > 0 && (
            <View style={styles.insightItem}>
              <Text style={styles.insightText}>
                You've missed {missedDoses} dose{missedDoses > 1 ? 's' : ''} this period.
              </Text>
            </View>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  adherenceContainer: {
    alignItems: 'center',
  },
  circleProgress: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  adherencePercentage: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  adherenceLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardPrimary: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  statCardWarning: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  statCardInfo: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    marginTop: 20,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 20,
  },
  chartLabel: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: 20,
  },
  breakdownItem: {
    marginBottom: 16,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  breakdownRate: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  insightItem: {
    marginBottom: 12,
    paddingLeft: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  insightText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

