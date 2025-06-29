export interface CustomerTab {
  purchase: number;
  paid: number;
  due: number;
  _id: string;
}

export interface CustomerLocation {
  coordinates: [number, number] | [string, string];
}

export interface CustomerProfile {
  _id: string;
  name: string;
  username: string;
  address: string;
  phone: string[];
  profilePicture: string;
  role: string;
  tab: CustomerTab;
  location: CustomerLocation;
  createdAt: string;
  updatedAt: string;
  __v: number;
  password?:string;
}
