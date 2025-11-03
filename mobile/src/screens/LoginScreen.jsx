import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { api } from '../api.jsx';
import { colors, commonStyles } from '../styles.jsx';

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
      const data = await api.login({ email, password });
      const token = data?.token || data?.plain_text_token || data?.access_token;
      if (!token) throw new Error('No token in response');
      navigation.replace('Home', { token });
    } catch (e) {
      Alert.alert('Login Failed', e.message);
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
            placeholderTextColor={colors.textLight}
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
            placeholderTextColor={colors.textLight}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[commonStyles.button, loading && commonStyles.buttonDisabled]}
          onPress={onLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={commonStyles.buttonText}>Sign In</Text>
          )}
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
  forgotLink: {
    marginTop: 8,
  },
  forgotLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  registerButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 14,
    color: colors.textLight,
  },
  registerButtonTextBold: {
    fontWeight: '700',
    color: colors.accent,
  },
});
