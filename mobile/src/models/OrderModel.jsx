import { api } from '../api.jsx';

/**
 * Order Model
 * Handles order data operations
 */
export class OrderModel {
  /**
   * Create a new order
   */
  static async create(token, orderData) {
    try {
      return await api.createOrder(token, orderData);
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  /**
   * Get all orders
   */
  static async getAll(token) {
    try {
      return await api.getOrders(token);
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }
}

