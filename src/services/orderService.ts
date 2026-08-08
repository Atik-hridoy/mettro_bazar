import { apiClient } from './apiClient';

export interface OrderItemPayload {
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderPayload {
  customer_name: string;
  phone: string;
  delivery_address: string;
  delivery_zone_id?: string;
  payment_method: 'COD' | 'SSLCOMMERZ';
  notes?: string;
  items: OrderItemPayload[];
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  items?: any[];
}

export interface SSLCommerzInitResponse {
  status: string;
  GatewayPageURL: string;
  tran_id: string;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
    const response = await apiClient<OrderResponse>('/orders/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response;
  },

  async getOrderById(orderId: string): Promise<OrderResponse> {
    const response = await apiClient<OrderResponse>(`/orders/${orderId}/`);
    return response;
  },

  async initPayment(orderId: string): Promise<SSLCommerzInitResponse> {
    const response = await apiClient<SSLCommerzInitResponse>('/payments/sslcommerz/init/', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
    });
    return response;
  },
};
