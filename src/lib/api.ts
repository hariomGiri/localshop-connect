import { UserRole } from '@/types/user';

// API base URL
const API_URL = 'http://localhost:5001/api';

// Types for API requests and responses
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  message?: string;
}

export interface ShopFormData {
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

export interface ShopResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export interface ProductResponse {
  success: boolean;
  data?: any;
  count?: number;
  message?: string;
}

// Helper function for making API requests
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Set default headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make the request
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    // Parse the response
    const data = await response.json();

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data as T;
  } catch (error) {
    throw error;
  }
}

// Auth API functions
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string; role: UserRole }): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/me');
  },

  updateProfile: async (profileData: { name: string }): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Shop API functions
export const shopAPI = {
  registerShop: async (shopData: ShopFormData): Promise<ShopResponse> => {
    return apiRequest<ShopResponse>('/shops/register', {
      method: 'POST',
      body: JSON.stringify(shopData),
    });
  },

  getShops: async (): Promise<ShopResponse> => {
    return apiRequest<ShopResponse>('/shops');
  },

  getShop: async (id: string): Promise<ShopResponse> => {
    return apiRequest<ShopResponse>(`/shops/${id}`);
  },

  getMyShop: async (): Promise<ShopResponse> => {
    return apiRequest<ShopResponse>('/shops/user/myshop');
  },

  updateShop: async (id: string, shopData: FormData | Partial<ShopFormData>): Promise<ShopResponse> => {
    // Check if shopData is FormData
    if (shopData instanceof FormData) {
      // For FormData, don't set Content-Type header (browser will set it with boundary)
      return apiRequest<ShopResponse>(`/shops/${id}`, {
        method: 'PUT',
        headers: {}, // Let the browser set the content type for FormData
        body: shopData,
      });
    } else {
      // For JSON data
      return apiRequest<ShopResponse>(`/shops/${id}`, {
        method: 'PUT',
        body: JSON.stringify(shopData),
      });
    }
  },

  getNearbyShops: async (lat: number, lng: number, distance?: number): Promise<ShopResponse> => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
    });

    if (distance) {
      params.append('distance', distance.toString());
    }

    return apiRequest<ShopResponse>(`/shops/nearby?${params.toString()}`);
  },

  // Admin API functions
  getPendingShops: async (): Promise<ShopResponse> => {
    return apiRequest<ShopResponse>('/admin/shops/pending');
  },

  approveShop: async (id: string, status: 'approved' | 'rejected'): Promise<ShopResponse> => {
    return apiRequest<ShopResponse>(`/shops/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Admin dashboard stats
  getAdminStats: async (): Promise<{
    success: boolean;
    data?: {
      totalUsers: number;
      activeShops: number;
      totalProducts: number;
      platformRevenue: number;
    };
    message?: string;
  }> => {
    return apiRequest('/admin/stats');
  },

  // Get recent users for admin dashboard
  getRecentUsers: async (): Promise<ShopResponse> => {
    return apiRequest<ShopResponse>('/admin/users/recent');
  },
};

// Product API functions
export const productAPI = {
  getProducts: async (): Promise<ProductResponse> => {
    return apiRequest<ProductResponse>('/products');
  },

  getProduct: async (id: string): Promise<ProductResponse> => {
    return apiRequest<ProductResponse>(`/products/${id}`);
  },

  getShopProducts: async (shopId: string): Promise<ProductResponse> => {
    return apiRequest<ProductResponse>(`/products/shop/${shopId}`);
  },

  getMyProducts: async (): Promise<ProductResponse> => {
    return apiRequest<ProductResponse>('/products/my/products');
  },

  createProduct: async (productData: FormData): Promise<ProductResponse> => {
    return apiRequest<ProductResponse>('/products', {
      method: 'POST',
      headers: {}, // Let the browser set the content type for FormData
      body: productData,
    });
  },

  updateProduct: async (id: string, productData: FormData): Promise<ProductResponse> => {
    return apiRequest<ProductResponse>(`/products/${id}`, {
      method: 'PUT',
      headers: {}, // Let the browser set the content type for FormData
      body: productData,
    });
  },

  deleteProduct: async (id: string): Promise<ProductResponse> => {
    return apiRequest<ProductResponse>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};