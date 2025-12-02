import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import MedicationsScreen from './screens/MedicationsScreen.jsx';
import ScanScreen from './screens/ScanScreen.jsx';
import AnalyticsScreen from './screens/AnalyticsScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import MedicineDetailsScreen from './screens/MedicineDetailsScreen.jsx';
import RemindersScreen from './screens/RemindersScreen.jsx';
import AddEditReminderScreen from './screens/AddEditReminderScreen.jsx';
import PharmaciesScreen from './screens/PharmaciesScreen.jsx';
import NewOrdersScreen from './screens/NewOrdersScreen.jsx';
import PaymentScreen from './screens/PaymentScreen.jsx';
import BottomNavigation from './navigation/BottomNavigation.jsx';
import { colors } from './styles.jsx';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.foreground,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: 'Reset Password' }}
        />
        <Stack.Screen
          name="Main"
          component={BottomNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MedicineDetails"
          component={MedicineDetailsScreen}
          options={{ title: 'Medication Details', presentation: 'card' }}
        />
        <Stack.Screen
          name="Reminders"
          component={RemindersScreen}
          options={{ title: 'Reminders', presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="AddEditReminder"
          component={AddEditReminderScreen}
          options={{ title: 'Reminder', presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="Pharmacies"
          component={PharmaciesScreen}
          options={{ title: 'Pharmacies', presentation: 'card', headerShown: false }}
        />
        <Stack.Screen
          name="NewOrders"
          component={NewOrdersScreen}
          options={({ route }) => ({
            title: 'New Order',
            presentation: 'card',
            headerShown: !route.params?.hideHeader,
          })}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{ title: 'Payment', presentation: 'card' }}
        />
        <Stack.Screen
          name="Medications"
          component={MedicationsScreen}
          options={({ route }) => ({
            title: 'Medications',
            presentation: 'card',
            headerShown: !route.params?.hideHeader,
          })}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={({ route }) => ({
            title: 'Scan Medication',
            presentation: 'card',
            headerShown: !route.params?.hideHeader,
          })}
        />
        <Stack.Screen
          name="Analytics"
          component={AnalyticsScreen}
          options={({ route }) => ({
            title: 'Analytics',
            presentation: 'card',
            headerShown: !route.params?.hideHeader,
          })}
        />
        <Stack.Screen
          name="PaymentMethods"
          component={ProfileScreen}
          options={{ title: 'Payment Methods', presentation: 'card' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
