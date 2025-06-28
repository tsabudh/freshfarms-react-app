export interface CustomerTab {
  purchase: number;
  paid: number;
  due: number;
  _id: string;
}

export interface CustomerLocation {
  coordinates: [number, number] | [string, string]; // If you know coordinate type (e.g., number[]), specify it instead of any[]
}

export interface CustomerProfile {
  _id: string;
  name: string;
  username: string;
  address: string;
  phone: string[];
  profilePicture: string;
  role: string; // could be union of roles if known, e.g. 'customer' | 'admin'
  tab: CustomerTab;
  location: CustomerLocation;
  createdAt: string;  // or Date if you convert ISO string to Date
  updatedAt: string;  // or Date
  __v: number;
}