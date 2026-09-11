import { CategoryItem, Product } from './constants';
import { getClientDeviceInfo } from './deviceInfo';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('metrobazar.online')
    ? 'https://api.metrobazar.online/api'
    : 'http://127.0.0.1:8000/api');

/**
 * Custom Fetch Wrapper with Postman-style visual logger.
 * Works seamlessly in both Next.js Server Terminal (with ANSI colors) & Browser Console.
 */
async function loggedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const startTime = Date.now();
  const method = (options.method || 'GET').toUpperCase();
  const isServer = typeof window === 'undefined';

  const reqHeaders: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!isServer) {
    const token = localStorage.getItem('mb_access_token');
    if (token && !reqHeaders['Authorization']) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const finalOptions: RequestInit = {
    ...options,
    headers: reqHeaders,
  };

  if (isServer) {
    console.log(`\n\x1b[45m\x1b[37m 🚀 [POSTMAN REQ] ${method} \x1b[0m \x1b[36m${url}\x1b[0m`);
    if (finalOptions.headers) console.log(`\x1b[33m📋 Headers:\x1b[0m`, finalOptions.headers);
    if (finalOptions.body) {
      try {
        console.log(`\x1b[33m📦 Body:\x1b[0m`, typeof finalOptions.body === 'string' ? JSON.parse(finalOptions.body) : finalOptions.body);
      } catch {
        console.log(`\x1b[33m📦 Body:\x1b[0m`, finalOptions.body);
      }
    }
  } else {
    console.log(
      `%c 🚀 [POSTMAN REQ] ${method} %c ${url}`,
      'background: #FF6C37; color: white; font-weight: bold; padding: 2px 6px; border-radius: 3px;',
      'color: #0070f3; font-weight: bold;'
    );
    if (finalOptions.headers) console.log('📋 Headers:', finalOptions.headers);
    if (finalOptions.body) {
      try {
        console.log('📦 Body:', typeof finalOptions.body === 'string' ? JSON.parse(finalOptions.body) : finalOptions.body);
      } catch {
        console.log('📦 Body:', finalOptions.body);
      }
    }
  }

  try {
    const res = await fetch(url, finalOptions);
    const duration = Date.now() - startTime;
    const clonedRes = res.clone();

    let data: any;
    try {
      data = await clonedRes.json();
    } catch {
      data = '[Non-JSON Data]';
    }

    if (isServer) {
      const statusColor = res.ok ? '\x1b[42m\x1b[37m' : '\x1b[41m\x1b[37m';
      console.log(`${statusColor} 📥 [POSTMAN RES] ${res.status} ${res.statusText || 'OK'} \x1b[0m \x1b[33m(${duration}ms)\x1b[0m \x1b[36m${method} ${url}\x1b[0m`);
      console.log(`\x1b[32m📄 Response Data:\x1b[0m`, JSON.stringify(data, null, 2));
      console.log(`--------------------------------------------------\n`);
    } else {
      const bg = res.ok ? '#00B87C' : '#E02020';
      console.log(
        `%c 📥 [POSTMAN RES] ${res.status} ${res.statusText || 'OK'} %c (${duration}ms) %c ${method} ${url}`,
        `background: ${bg}; color: white; font-weight: bold; padding: 2px 6px; border-radius: 3px;`,
        'color: #f5a623; font-weight: bold;',
        'color: #888;'
      );
      console.log('📄 Response Data:', data);
      console.log('--------------------------------------------------\n');
    }

    if (res.status === 401 && !isServer) {
      if (localStorage.getItem('mb_access_token')) {
        console.warn('🔑 Expired or invalid token detected (401). Removing mb_access_token from localStorage.');
        localStorage.removeItem('mb_access_token');
      }
    }

    return res;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    if (isServer) {
      console.log(`\x1b[41m\x1b[37m ❌ [POSTMAN ERR] ${error.message} \x1b[0m \x1b[33m(${duration}ms)\x1b[0m \x1b[36m${method} ${url}\x1b[0m`);
      console.log(`--------------------------------------------------\n`);
    } else {
      console.log(
        `%c ❌ [POSTMAN ERR] ${error.message} %c (${duration}ms) %c ${method} ${url}`,
        'background: #E02020; color: white; font-weight: bold; padding: 2px 6px; border-radius: 3px;',
        'color: #f5a623; font-weight: bold;',
        'color: #888;'
      );
    }
    throw error;
  }
}

export async function fetchCategoriesFromBackend(): Promise<CategoryItem[]> {
  try {
    const res = await loggedFetch(`${API_BASE_URL}/catalog/categories/`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }

    const data = await res.json();
    const rawCategories = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);

    if (rawCategories.length === 0) {
      return [];
    }

    const mapCategory = (item: any): CategoryItem => ({
      id: String(item.id),
      name: item.name_en,
      slug: item.slug,
      image: item.icon || item.banner || undefined,
      hasChildren: Array.isArray(item.children) && item.children.length > 0,
      children: Array.isArray(item.children) ? item.children.map(mapCategory) : [],
    });

    const parsed = rawCategories.map(mapCategory);

    const foodRoot = parsed.find(
      (c) => c.name.toLowerCase() === 'food' || c.slug === 'food'
    );

    if (foodRoot && foodRoot.children && foodRoot.children.length > 0) {
      return foodRoot.children;
    }

    return parsed;
  } catch (error) {
    console.error('Backend category API error:', error);
    return [];
  }
}

function formatImageUrl(rawUrl?: string): string {
  if (!rawUrl) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80';
  if (rawUrl.includes('/media/https%3A/') || rawUrl.includes('/media/http%3A/')) {
    const parts = rawUrl.split('/media/');
    if (parts[1]) {
      return decodeURIComponent(parts[1]);
    }
  }
  if (rawUrl.includes('/media/https://') || rawUrl.includes('/media/http://')) {
    const idx = rawUrl.indexOf('/media/');
    return rawUrl.substring(idx + 7);
  }
  return rawUrl;
}

export async function fetchProductsFromBackend(): Promise<Product[]> {
  try {
    const res = await loggedFetch(`${API_BASE_URL}/products/items/`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data = await res.json();
    const rawProducts = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);

    return rawProducts.map((p: any) => {
      const price = Number(p.selling_price || p.base_price || 0);
      const basePrice = p.base_price ? Number(p.base_price) : 0;
      const originalPrice = basePrice > price ? basePrice : undefined;

      return {
        id: String(p.id),
        name: p.name_en,
        banglaName: p.name_bn || undefined,
        price,
        originalPrice,
        unit: p.unit || '1 pc',
        deliveryTime: '2 hrs',
        image: formatImageUrl(p.image),
        categorySlug: p.category_name ? p.category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'grocery',
        categoryId: p.category,
        category: p.category_name,
        inStock: p.in_stock ?? true,
      };
    });
  } catch (error) {
    console.error('Backend product API error:', error);
    return [];
  }
}

export async function syncGuestCartToBackend(
  guestId: string,
  cartItems: any[],
  city: string = 'Dhaka',
  userInfo?: { email?: string; phone?: string }
) {
  try {
    const deviceInfo = getClientDeviceInfo();
    await loggedFetch(`${API_BASE_URL}/cart/guest-sync/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guest_id: guestId,
        city,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        device_info: deviceInfo.device_info,
        user_email: userInfo?.email || undefined,
        user_phone: userInfo?.phone || undefined,
        cart_items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    });
  } catch (err) {
    console.error('Guest cart sync error:', err);
  }
}

export async function fetchGuestCartFromBackend(guestId: string) {
  try {
    const res = await loggedFetch(`${API_BASE_URL}/cart/guest-fetch/?guest_id=${encodeURIComponent(guestId)}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error('Fetch guest cart error:', err);
  }
  return null;
}

export async function convertGuestCartOnBackend(guestId: string, email?: string) {
  try {
    await loggedFetch(`${API_BASE_URL}/cart/guest-convert/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guest_id: guestId, email }),
    });
  } catch (err) {
    console.error('Guest cart convert error:', err);
  }
}

export async function checkUserRegistration(identity: string): Promise<{ is_registered: boolean; identity: string }> {
  try {
    const res = await loggedFetch(`${API_BASE_URL}/auth/check-user/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Check user error:', err);
  }
  return { is_registered: false, identity };
}

export async function registerUserOnBackend(payload: {
  phone_number?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  password: string;
  confirm_password: string;
}) {
  try {
    const res = await loggedFetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      let errorMsg = 'Registration failed.';
      if (typeof data.detail === 'string') {
        errorMsg = data.detail;
      } else if (typeof data.error === 'string') {
        errorMsg = data.error;
      } else if (data.non_field_errors && Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
        errorMsg = data.non_field_errors[0];
      } else if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey])) {
          errorMsg = `${firstKey}: ${data[firstKey][0]}`;
        } else if (firstKey && typeof data[firstKey] === 'string') {
          errorMsg = data[firstKey];
        }
      }
      throw new Error(errorMsg);
    }

    if (data?.tokens?.access && typeof window !== 'undefined') {
      localStorage.setItem('mb_access_token', data.tokens.access);
    }

    return data;
  } catch (err: any) {
    console.error('Register user error:', err);
    throw err;
  }
}

export async function loginUserOnBackend(identity: string, password: string) {
  try {
    const res = await loggedFetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: identity,
        identity: identity,
        password: password,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      let errorMsg = 'Invalid phone/email or password.';
      if (typeof data.detail === 'string') {
        errorMsg = data.detail;
      } else if (typeof data.error === 'string') {
        errorMsg = data.error;
      } else if (data.non_field_errors && Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
        errorMsg = data.non_field_errors[0];
      } else if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey])) {
          errorMsg = `${firstKey}: ${data[firstKey][0]}`;
        } else if (firstKey && typeof data[firstKey] === 'string') {
          errorMsg = data[firstKey];
        }
      }
      throw new Error(errorMsg);
    }

    if (data?.tokens?.access && typeof window !== 'undefined') {
      localStorage.setItem('mb_access_token', data.tokens.access);
    }

    return data;
  } catch (err: any) {
    console.error('Login user error:', err);
    throw err;
  }
}

export async function fetchUserProfileFromBackend() {
  try {
    const res = await loggedFetch(`${API_BASE_URL}/accounts/profile/`, {
      cache: 'no-store',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Fetch user profile error:', err);
  }
  return null;
}

export async function updateUserProfileOnBackend(payload: {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  date_of_birth?: string;
}) {
  try {
    const res = await loggedFetch(`${API_BASE_URL}/accounts/profile/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      let errorMsg = 'Failed to update profile.';
      if (typeof data.detail === 'string') errorMsg = data.detail;
      else if (typeof data.error === 'string') errorMsg = data.error;
      else if (typeof data === 'object') errorMsg = JSON.stringify(data);
      throw new Error(errorMsg);
    }
    return data;
  } catch (err: any) {
    console.error('Update user profile error:', err);
    throw err;
  }
}

export async function fetchAddressesFromBackend() {
  try {
    const res = await loggedFetch(`${API_BASE_URL}/accounts/addresses/`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
    }
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('mb_access_token');
    }
  } catch (err) {
    console.error('Fetch addresses error:', err);
  }
  return [];
}

export async function saveAddressToBackend(payload: {
  id?: number | string;
  title: string;
  address_type?: string;
  street_address: string;
  area: string;
  city: string;
  is_default?: boolean;
}) {
  try {
    const isEdit = Boolean(payload.id);
    const url = isEdit ? `${API_BASE_URL}/accounts/addresses/${payload.id}/` : `${API_BASE_URL}/accounts/addresses/`;
    const method = isEdit ? 'PUT' : 'POST';

    const cityVal = payload.city ? payload.city.trim() : 'Dhaka';
    const areaVal = payload.area ? payload.area.trim() : cityVal;

    const res = await loggedFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: payload.title || 'Home',
        address_type: payload.address_type || 'home',
        street_address: payload.street_address,
        area: areaVal,
        city: cityVal,
        is_default: payload.is_default ?? true,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401 || data.code === 'token_not_valid' || (typeof data.detail === 'string' && data.detail.includes('token'))) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mb_access_token');
        }
        throw new Error('Your login session has expired. Please log in again to save your address.');
      }
      let errorMsg = 'Failed to save address.';
      if (typeof data.detail === 'string') errorMsg = data.detail;
      else if (typeof data.error === 'string') errorMsg = data.error;
      else if (typeof data === 'object') errorMsg = JSON.stringify(data);
      throw new Error(errorMsg);
    }
    return data;
  } catch (err: any) {
    console.error('Save address error:', err);
    throw err;
  }
}

export async function deleteAddressFromBackend(id: number | string) {
  try {
    const res = await loggedFetch(`${API_BASE_URL}/accounts/addresses/${id}/`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('Delete address error:', err);
    return false;
  }
}

export async function placeOrderOnBackend(payload: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: {
    recipient_name: string;
    recipient_phone: string;
    street_address: string;
    area: string;
    city: string;
  };
  items: any[];
  subtotal: number;
  delivery_fee: number;
  discount_amount?: number;
  total_amount: number;
  note?: string;
}) {
  try {
    const res = await loggedFetch(`${API_BASE_URL}/orders/place-order/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.error || 'Failed to place order.');
    }
    return data;
  } catch (err: any) {
    console.error('Place order API error:', err);
    throw err;
  }
}

export async function fetchUserOrdersFromBackend(userPhone?: string, userEmail?: string) {
  try {
    let queryStr = '';
    if (userPhone && !userPhone.includes('@')) {
      queryStr = `?phone=${encodeURIComponent(userPhone)}`;
    } else if (userEmail && userEmail.includes('@')) {
      queryStr = `?email=${encodeURIComponent(userEmail)}`;
    }

    const res = await loggedFetch(`${API_BASE_URL}/orders/${queryStr}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
    }
  } catch (err) {
    console.error('Fetch user orders error:', err);
  }
  return [];
}


