import { UserProfile } from "./user.interface";

export interface AuthContextInterface {
  jwtToken: string | null;
  user: UserProfile | null;
  setJwtToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
}