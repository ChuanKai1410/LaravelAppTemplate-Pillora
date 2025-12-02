import React from 'react';
import { Alert } from 'react-native';
import { useHomeController } from '../controllers/HomeController.jsx';
import HomeView from '../views/HomeView.jsx';

/**
 * Home Screen
 * Connects Controller and View
 */
export default function HomeScreen({ route, navigation }) {
  const { token } = route.params || {};
  const { user, dashboard, loading, error } = useHomeController(token);

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleScanPress = () => {
    // Navigate to Scan tab in bottom navigation
    // Since we're in a tab navigator, we can navigate directly to the tab
    navigation.navigate('ScanTab', { token });
  };

  const handleMedicationsPress = () => {
    navigation.navigate('Medications', { token, hideHeader: true });
  };

  const handleRemindersPress = () => {
    navigation.navigate('Reminders', { token });
  };

  const handlePharmaciesPress = () => {
    navigation.navigate('Pharmacies', { token });
  };

  const handleAnalyticsPress = () => {
    // Navigate to Analytics tab in bottom navigation
    navigation.navigate('AnalyticsTab', { token });
  };

  return (
    <HomeView
      user={user}
      dashboard={dashboard}
      loading={loading}
      onScanPress={handleScanPress}
      onMedicationsPress={handleMedicationsPress}
      onRemindersPress={handleRemindersPress}
      onPharmaciesPress={handlePharmaciesPress}
      onAnalyticsPress={handleAnalyticsPress}
    />
  );
}
