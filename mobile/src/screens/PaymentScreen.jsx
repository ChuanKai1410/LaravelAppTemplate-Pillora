import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '../styles.jsx';
import { api } from '../api.jsx';

export default function PaymentScreen({ navigation, route }) {
  const { token, order } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
        Alert.alert('Required', 'Please fill in all card details');
        return;
      }
    }

    try {
      setProcessing(true);
      await api.processPayment(token, {
        orderId: order.id,
        paymentMethod,
        cardData: paymentMethod === 'card' ? cardData : null,
      });
      Alert.alert('Success', 'Payment processed successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Home', { token }) },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
        <Text style={styles.headerSubtitle}>Complete your order</Text>
      </View>

      <View style={styles.content}>
        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>${order?.total || '0.00'}</Text>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('card')}
          >
            <Text style={styles.paymentOptionText}>Credit/Debit Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'paypal' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('paypal')}
          >
            <Text style={styles.paymentOptionText}>PayPal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'apple' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('apple')}
          >
            <Text style={styles.paymentOptionText}>Apple Pay</Text>
          </TouchableOpacity>
        </View>

        {/* Card Details */}
        {paymentMethod === 'card' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Card Details</Text>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChangeText={(text) => setCardData({ ...cardData, number: text })}
              keyboardType="numeric"
              maxLength={19}
            />
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Expiry</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChangeText={(text) => setCardData({ ...cardData, expiry: text })}
                  maxLength={5}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={cardData.cvv}
                  onChangeText={(text) => setCardData({ ...cardData, cvv: text })}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={cardData.name}
              onChangeText={(text) => setCardData({ ...cardData, name: text })}
            />
          </View>
        )}

        {/* Process Payment Button */}
        <TouchableOpacity
          style={[styles.payButton, processing && styles.buttonDisabled]}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.payButtonText}>Pay ${order?.total || '0.00'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
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
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
  },
  paymentOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 12,
  },
  paymentOptionSelected: {
    borderColor: colors.accent,
    backgroundColor: '#f0f7ff',
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  payButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  payButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});

