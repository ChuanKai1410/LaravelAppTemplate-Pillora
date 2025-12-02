import { api } from '../api.jsx';

/**
 * Payment Model
 * Handles payment data operations
 */
export class PaymentModel {
  /**
   * Process payment
   */
  static async process(token, paymentData) {
    try {
      return await api.processPayment(token, paymentData);
    } catch (error) {
      throw new Error(`Failed to process payment: ${error.message}`);
    }
  }
}

