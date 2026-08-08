import type { Product, WeightVariant } from './product';

export interface CartItem {
  product: Product;
  selectedVariant: WeightVariant;
  quantity: number;
}
