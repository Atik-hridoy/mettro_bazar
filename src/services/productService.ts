import { apiClient } from './apiClient';
import type { Product } from '../types/product';
import type { Category } from '../types/category';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export const productService = {
  async getProducts(categorySlug?: string, searchQuery?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (categorySlug && categorySlug !== 'all') {
        params.append('category', categorySlug);
      }
      if (searchQuery && searchQuery.trim() !== '') {
        params.append('search', searchQuery.trim());
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await apiClient<ProductListResponse>(`/products/${queryString}`);
      return response.results;
    } catch (err) {
      console.warn('Backend products endpoint offline, using local mock:', err);
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
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await apiClient<Product>(`/products/${id}/`);
      return product;
    } catch (err) {
      console.warn(`Backend product ${id} offline, using local mock:`, err);
      const product = (productsData as Product[]).find((p) => p.id === id);
      return product || null;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const categories = await apiClient<Category[]>('/categories/');
      return categories;
    } catch (err) {
      console.warn('Backend categories endpoint offline, using local mock:', err);
      return categoriesData as Category[];
    }
  },
};
