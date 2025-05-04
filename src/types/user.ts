
export type UserRole = 'customer' | 'shopkeeper' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface ShopkeeperProfile extends User {
  shopId?: string; // ID of the shop they own
}

export interface AdminProfile extends User {
  permissions: string[]; // Various admin permissions
}

export interface CustomerProfile extends User {
  address?: string;
  favoriteShops: string[];
}
