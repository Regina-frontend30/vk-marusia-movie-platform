import { useCallback, useEffect, useMemo, useState } from "react";

import { getProfile, type Profile } from "../../shared/api/auth";

import { AuthContext } from "./AuthContext";

type Props = {
  children: React.ReactNode;
};

function useAuthProviderValue(args: {
  loading: boolean;
  user: Profile | null;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<Profile | null>>;
}) {
  return useMemo(
    () => ({
      loading: args.loading,
      user: args.user,
      refreshUser: args.refreshUser,
      setUser: args.setUser,
    }),
    [args.loading, args.refreshUser, args.setUser, args.user]
  );
}

function useAuthProviderState() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return { loading, user, refreshUser, setUser };
}

export function AuthProvider({ children }: Props) {
  const authState = useAuthProviderState();
  const value = useAuthProviderValue({
    loading: authState.loading,
    user: authState.user,
    refreshUser: authState.refreshUser,
    setUser: authState.setUser,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
