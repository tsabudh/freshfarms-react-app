import React from "react";
import { UserProfile } from "./user.interface";

export interface AuthContextInterface {
  jwtToken: string | null;
  user: UserProfile | null;
  setJwtToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
}
