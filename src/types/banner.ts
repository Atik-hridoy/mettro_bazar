export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  bannerType: 'hero' | 'promo' | 'side';
  is_active: boolean;
  order: number;
}
