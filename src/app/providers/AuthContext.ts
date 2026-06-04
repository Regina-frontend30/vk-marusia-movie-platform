import { createContext } from "react";

import type { Profile } from "../../shared/api/auth";

export type AuthContextValue = {
  loading: boolean;
  user: Profile | null;
  refreshUser: () => Promise<void>;
  setUser: (user: Profile | null) => void;
};

export const AuthContext =
  createContext<AuthContextValue | null>(null);
