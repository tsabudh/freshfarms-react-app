export interface UserProfile {
  _id: string;
  name: string;
  phone: string[];
  profilePicture: string;
  createdAt: string | Date; 
  username: string;
  userRole: 'admin' | 'customer';
  __v?: number;
}