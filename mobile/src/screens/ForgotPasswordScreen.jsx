import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { api } from '../api.jsx';
import { colors, commonStyles } from '../styles.jsx';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [sent, setSent] = useState(false);

  const onSend = async () => {
    if (!email) {
      Alert.alert('Required', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await api.forgotPassword({ email });
      setSent(true);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={commonStyles.title}>Check Your Email</Text>
            <Text style={[commonStyles.subtitle, styles.successMessage]}>
              We've sent a password reset link to{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            <Text style={styles.instruction}>
              Please check your inbox and follow the instructions to reset your password.
            </Text>
            <TouchableOpacity
              style={[commonStyles.button, styles.backButton]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={commonStyles.buttonText}>Back to Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                setSent(false);
                setEmail('');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.resendButtonText}>Resend Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={commonStyles.content}>
        <View style={commonStyles.header}>
          <Text style={commonStyles.title}>Forgot Password</Text>
          <Text style={commonStyles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
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

        <TouchableOpacity
          style={[commonStyles.button, loading && commonStyles.buttonDisabled]}
          onPress={onSend}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={commonStyles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.goBack()}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.backLinkText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  successContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 40,
    color: colors.white,
    fontWeight: '700',
  },
  successMessage: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emailText: {
    fontWeight: '600',
    color: colors.text,
  },
  instruction: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  backButton: {
    marginTop: 8,
  },
  resendButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  backLink: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 12,
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
});
