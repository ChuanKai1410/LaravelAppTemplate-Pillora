import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '../api.jsx';
import { colors, commonStyles, gradients } from '../styles.jsx';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting login with:', email);
      const data = await api.login({ email, password });
      console.log('Login response:', data);
      
      const token = data?.token || data?.plain_text_token || data?.access_token;
      if (!token) {
        console.error('No token in response:', data);
        throw new Error('No authentication token received. Please try again.');
      }
      
      console.log('Login successful, navigating to Main');
      navigation.replace('Main', { token });
    } catch (e) {
      console.error('Login error:', e);
      const errorMessage = e.message || 'Login failed. Please check your credentials and try again.';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={commonStyles.content}>
        <View style={commonStyles.header}>
          <Text style={commonStyles.title}>Welcome Back</Text>
          <Text style={commonStyles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={commonStyles.inputContainer}>
          <Text style={commonStyles.label}>Email</Text>
          <TextInput
            style={[commonStyles.input, focusedInput === 'email' && commonStyles.inputFocused]}
            placeholder="Enter your email"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            editable={!loading}
          />
        </View>

        <View style={commonStyles.inputContainer}>
          <Text style={commonStyles.label}>Password</Text>
          <TextInput
            style={[commonStyles.input, focusedInput === 'password' && commonStyles.inputFocused]}
            placeholder="Enter your password"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={styles.loginButtonContainer}
          onPress={onLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={loading ? [colors.muted, colors.muted] : gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={commonStyles.linkContainer}>
          <TouchableOpacity
            style={styles.forgotLink}
            onPress={() => navigation.navigate('ForgotPassword')}
            disabled={loading}
          >
            <Text style={styles.forgotLinkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={commonStyles.divider}>
          <View style={commonStyles.dividerLine} />
          <Text style={commonStyles.dividerText}>OR</Text>
          <View style={commonStyles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.registerButtonText}>
            Don't have an account? <Text style={styles.registerButtonTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loginButtonContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: colors.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
  forgotLink: {
    marginTop: 8,
  },
  forgotLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  registerButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  registerButtonTextBold: {
    fontWeight: '700',
    color: colors.primary,
  },
});
