import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { api } from '../api.jsx';
import { colors, commonStyles } from '../styles.jsx';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const onRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      Alert.alert('Required', 'Please fill in all fields');
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      await api.register({ name, email, password, password_confirmation: passwordConfirmation });
      Alert.alert('Success', 'Account created successfully. Please sign in.');
      navigation.replace('Login');
    } catch (e) {
      Alert.alert('Registration Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={commonStyles.content}>
        <View style={commonStyles.header}>
          <Text style={commonStyles.title}>Create Account</Text>
          <Text style={commonStyles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={commonStyles.inputContainer}>
          <Text style={commonStyles.label}>Full Name</Text>
          <TextInput
            style={[commonStyles.input, focusedInput === 'name' && commonStyles.inputFocused]}
            placeholder="Enter your name"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={setName}
            onFocus={() => setFocusedInput('name')}
            onBlur={() => setFocusedInput(null)}
            editable={!loading}
          />
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
          <Text style={styles.hint}>Must be at least 8 characters</Text>
        </View>

        <View style={commonStyles.inputContainer}>
          <Text style={commonStyles.label}>Confirm Password</Text>
          <TextInput
            style={[commonStyles.input, focusedInput === 'confirm' && commonStyles.inputFocused]}
            placeholder="Confirm your password"
            placeholderTextColor={colors.textLight}
            secureTextEntry
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            onFocus={() => setFocusedInput('confirm')}
            onBlur={() => setFocusedInput(null)}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[commonStyles.button, loading && commonStyles.buttonDisabled]}
          onPress={onRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={commonStyles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={commonStyles.divider}>
          <View style={commonStyles.dividerLine} />
          <Text style={commonStyles.dividerText}>OR</Text>
          <View style={commonStyles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>
            Already have an account? <Text style={styles.loginButtonTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 6,
  },
  loginButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 14,
    color: colors.textLight,
  },
  loginButtonTextBold: {
    fontWeight: '700',
    color: colors.accent,
  },
});
