import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types/product';
import type { Category } from '../types/category';
import { productService } from '../services/productService';

export function useProducts(selectedCategory?: string, searchQuery?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts(selectedCategory, searchQuery),
        productService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, categories, isLoading, error, refetch: fetchProducts };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const prod = await productService.getProductById(id);
        setProduct(prod);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, isLoading, error };
}
