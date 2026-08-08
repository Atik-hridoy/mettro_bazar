import { apiClient } from './apiClient';
import type { Banner } from '../types/banner';

export const bannerService = {
  async getBanners(): Promise<Banner[]> {
    try {
      const banners = await apiClient<Banner[]>('/banners/');
      if (banners && banners.length > 0) {
        return banners;
      }
    } catch (err) {
      console.error('Failed to fetch banners from backend, using default dynamic banners:', err);
    }

    // Default fallback banners for dynamic carousel
    return [
      {
        id: 'banner-1',
        title: 'Fresh Homemade Quality Delivered',
        subtitle: 'Experience authentic Bangladeshi cooking with pre-marinated meats, frozen parathas, & gourmet dish kits.',
        badgeText: '100% Ready-To-Cook',
        image: '/images/hero.jpg',
        buttonText: 'Shop Ready-to-Cook',
        buttonLink: '#products',
        bannerType: 'hero',
        is_active: true,
        order: 1,
      },
      {
        id: 'banner-2',
        title: 'Pre-Marinated Gourmet Beef & Mutton',
        subtitle: 'Chef-crafted recipes ready to cook in under 20 minutes. No hassle, zero prep time required.',
        badgeText: '🔥 Chef Special 20% OFF',
        image: '/images/beef-curry.jpg',
        buttonText: 'Order Meat Kits',
        buttonLink: '#products',
        bannerType: 'hero',
        is_active: true,
        order: 2,
      },
      {
        id: 'banner-3',
        title: 'Crispy Frozen Parathas & Evening Snacks',
        subtitle: 'Golden flaky parathas and authentic Bangladeshi snacks frozen fresh for your family.',
        badgeText: '❄️ Frozen Fresh',
        image: '/images/paratha.jpg',
        buttonText: 'Explore Snacks',
        buttonLink: '#products',
        bannerType: 'hero',
        is_active: true,
        order: 3,
      },
    ];
  },
};
