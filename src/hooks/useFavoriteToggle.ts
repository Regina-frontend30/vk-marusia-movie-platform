import { useMemo, useState } from "react";

import { useAuth } from "../app/providers/useAuth";
import {
  addFavorite,
  removeFavorite,
} from "../shared/api/favorites";

function normalizeFavoriteIds(
  favorites: unknown
) {
  if (!Array.isArray(favorites)) {
    return [];
  }

  return favorites
    .map((favorite) => {
      if (
        typeof favorite === "string" ||
        typeof favorite === "number"
      ) {
        return String(favorite);
      }

      if (
        favorite &&
        typeof favorite === "object" &&
        "id" in favorite
      ) {
        const id = (favorite as { id?: unknown }).id;

        if (
          typeof id === "string" ||
          typeof id === "number"
        ) {
          return String(id);
        }
      }

      return null;
    })
    .filter((favoriteId): favoriteId is string =>
      Boolean(favoriteId)
    );
}

export function useFavoriteToggle(
  movieId: number | null
) {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const favoriteIds = useMemo(
    () => normalizeFavoriteIds(user?.favorites),
    [user?.favorites]
  );

  const isFavorite = Boolean(
    movieId !== null &&
      favoriteIds.includes(String(movieId))
  );

  async function toggleFavorite() {
    if (!user || movieId === null || loading) {
      return;
    }

    try {
      setLoading(true);

      if (isFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite(movieId);
      }

      await refreshUser();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    isFavorite,
    isAuthorized: Boolean(user),
    loading,
    disabled:
      !user || movieId === null || loading,
    toggleFavorite,
  };
}
