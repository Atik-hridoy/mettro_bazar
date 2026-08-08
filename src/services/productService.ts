import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import type { Product } from '../types/product';
import type { Category } from '../types/category';

// Simulated delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  async getProducts(categorySlug?: string, searchQuery?: string): Promise<Product[]> {
    await delay(400); // simulate network latency
    let result = productsData as Product[];

    if (categorySlug && categorySlug !== 'all') {
      result = result.filter((p) => p.category === categorySlug);
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(300);
    const product = (productsData as Product[]).find((p) => p.id === id);
    return product || null;
  },

  async getCategories(): Promise<Category[]> {
    await delay(200);
    return categoriesData as Category[];
  },
};
