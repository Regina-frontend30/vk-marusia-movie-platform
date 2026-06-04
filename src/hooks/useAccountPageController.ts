import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../app/providers/useAuth";
import { logout as logoutRequest } from "../shared/api/auth";
import { getMovieById } from "../shared/api/movies";
import type { Movie } from "../shared/types/movie";

type AccountUser = {
  firstName: string;
  lastName: string;
  email: string;
  favorites: Movie[];
};

function normalizeFavoriteIds(
  favorites: unknown
): string[] {
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

export function useAccountPageController() {
  const navigate = useNavigate();
  const { loading, user, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "favorites" | "settings"
  >("favorites");
  const [favoriteMovies, setFavoriteMovies] = useState<
    Movie[]
  >([]);
  const [favoritesLoading, setFavoritesLoading] =
    useState(false);

  useEffect(() => {
    async function loadFavoriteMovies() {
      if (!user) {
        setFavoriteMovies([]);
        return;
      }

      const favoriteIds = normalizeFavoriteIds(
        user.favorites
      );

      if (favoriteIds.length === 0) {
        setFavoriteMovies([]);
        return;
      }

      try {
        setFavoritesLoading(true);

        const movies = await Promise.all(
          favoriteIds.map((favoriteId) =>
            getMovieById(favoriteId)
          )
        );

        setFavoriteMovies(movies);
      } catch (error) {
        console.error(error);
        setFavoriteMovies([]);
      } finally {
        setFavoritesLoading(false);
      }
    }

    void loadFavoriteMovies();
  }, [user]);

  const accountUser = useMemo<AccountUser | null>(() => {
    if (!user) {
      return null;
    }

    return {
      firstName: user.name ?? "",
      lastName: user.surname ?? "",
      email: user.email,
      favorites: favoriteMovies,
    };
  }, [favoriteMovies, user]);

  const displayName = useMemo(() => {
    if (!accountUser) {
      return "";
    }

    return (
      [accountUser.firstName, accountUser.lastName]
        .filter(Boolean)
        .join(" ") || accountUser.email
    );
  }, [accountUser]);

  async function handleLogout() {
    try {
      await logoutRequest();
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      navigate("/", { replace: true });
    }
  }

  return {
    loading: loading || favoritesLoading,
    user: accountUser,
    activeTab,
    setActiveTab,
    displayName,
    logout: handleLogout,
    removeFavorite: () => {},
  };
}
