export interface WeightVariant {
  id: string;
  weight: string; // e.g., "500g", "1kg"
  price: number;
  stock: number;
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  instruction: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  badgeText?: string;
  isPopular?: boolean;
  isReadyToCook: boolean;
  preparationTimeMinutes: number;
  weightVariants: WeightVariant[];
  cookingSteps: CookingStep[];
}
