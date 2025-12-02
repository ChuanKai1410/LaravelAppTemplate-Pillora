import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../styles.jsx';
import HomeScreen from '../screens/HomeScreen.jsx';
import MedicationsScreen from '../screens/MedicationsScreen.jsx';
import ScanScreen from '../screens/ScanScreen.jsx';
import AnalyticsScreen from '../screens/AnalyticsScreen.jsx';
import ProfileScreen from '../screens/ProfileScreen.jsx';

const Tab = createBottomTabNavigator();

export default function BottomNavigation({ route }) {
  const { token } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: typography.textXs,
          fontWeight: typography.fontWeightSemibold,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size || 24} color={color} />,
        }}
      >
        {(props) => <HomeScreen {...props} route={{ ...props.route, params: { ...props.route?.params, token } }} />}
      </Tab.Screen>
      <Tab.Screen
        name="MedicationsTab"
        options={{
          tabBarLabel: 'Medications',
          tabBarIcon: ({ color, size }) => <Ionicons name="medical" size={size || 24} color={color} />,
        }}
      >
        {(props) => <MedicationsScreen {...props} route={{ ...props.route, params: { ...props.route?.params, token } }} />}
      </Tab.Screen>
      <Tab.Screen
        name="ScanTab"
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => <Ionicons name="scan" size={size || 24} color={color} />,
        }}
      >
        {(props) => <ScanScreen {...props} route={{ ...props.route, params: { ...props.route?.params, token } }} />}
      </Tab.Screen>
      <Tab.Screen
        name="AnalyticsTab"
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size || 24} color={color} />,
        }}
      >
        {(props) => <AnalyticsScreen {...props} route={{ ...props.route, params: { ...props.route?.params, token } }} />}
      </Tab.Screen>
      <Tab.Screen
        name="ProfileTab"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size || 24} color={color} />,
        }}
      >
        {(props) => <ProfileScreen {...props} route={{ ...props.route, params: { ...props.route?.params, token } }} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

