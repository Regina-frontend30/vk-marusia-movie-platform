import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../app/providers/useAuth";
import { logout as logoutRequest } from "../shared/api/auth";
import { removeFavorite } from "../shared/api/favorites";
import { getMovieById } from "../shared/api/movies";
import type { Movie } from "../shared/types/movie";

type AccountUser = {
  firstName: string;
  lastName: string;
  email: string;
  favorites: Movie[];
};

type ActiveTab = "favorites" | "settings";

type SetFavoriteMovies = React.Dispatch<
  React.SetStateAction<Movie[]>
>;

type SetFavoritesLoading = React.Dispatch<
  React.SetStateAction<boolean>
>;

type SetRemovingFavoriteId = React.Dispatch<
  React.SetStateAction<number | null>
>;

type FavoriteMoviesLoaderArgs = {
  favoriteIds: string[];
  setFavoriteMovies: SetFavoriteMovies;
  setFavoritesLoading: SetFavoritesLoading;
};

type FavoriteMoviesEffectArgs = {
  user: ReturnType<typeof useAuth>["user"];
  setFavoriteMovies: SetFavoriteMovies;
  setFavoritesLoading: SetFavoritesLoading;
};

type RemoveFavoriteArgs = {
  movieId: number;
  refreshUser: () => Promise<void>;
  setFavoriteMovies: SetFavoriteMovies;
  setRemovingFavoriteId: SetRemovingFavoriteId;
};

type LogoutArgs = {
  navigate: ReturnType<typeof useNavigate>;
  setUser: ReturnType<typeof useAuth>["setUser"];
};

type RemoveFavoriteHandlerArgs = {
  refreshUser: () => Promise<void>;
  setFavoriteMovies: SetFavoriteMovies;
  setRemovingFavoriteId: SetRemovingFavoriteId;
};

type AccountPageActionsArgs = LogoutArgs &
  RemoveFavoriteHandlerArgs;

type AccountPageControllerValueArgs = {
  loading: boolean;
  pageState: ReturnType<typeof useAccountPageState>;
  accountUser: AccountUser | null;
  displayName: string;
  logout: () => Promise<void>;
  removeFavorite: (movieId: number) => Promise<void>;
};

type AccountPageContext = {
  navigate: ReturnType<typeof useNavigate>;
  loading: boolean;
  user: ReturnType<typeof useAuth>["user"];
  setUser: ReturnType<typeof useAuth>["setUser"];
  refreshUser: () => Promise<void>;
  pageState: ReturnType<typeof useAccountPageState>;
  setFavoriteMovies: SetFavoriteMovies;
  setRemovingFavoriteId: SetRemovingFavoriteId;
};

function getObjectFavoriteId(favorite: unknown) {
  if (
    !favorite ||
    typeof favorite !== "object" ||
    !("id" in favorite)
  ) {
    return null;
  }

  const id = (favorite as { id?: unknown }).id;
  return typeof id === "string" || typeof id === "number"
    ? String(id)
    : null;
}

function getFavoriteId(favorite: unknown) {
  if (
    typeof favorite === "string" ||
    typeof favorite === "number"
  ) {
    return String(favorite);
  }

  return getObjectFavoriteId(favorite);
}

function normalizeFavoriteIds(
  favorites: unknown
): string[] {
  if (!Array.isArray(favorites)) {
    return [];
  }

  return favorites
    .map(getFavoriteId)
    .filter((favoriteId): favoriteId is string =>
      Boolean(favoriteId)
    );
}

async function fetchFavoriteMovies(favoriteIds: string[]) {
  const favoriteResults = await Promise.allSettled(
    favoriteIds.map((favoriteId) => getMovieById(favoriteId))
  );

  return favoriteResults.flatMap((favoriteResult) =>
    favoriteResult.status === "fulfilled"
      ? [favoriteResult.value]
      : []
  );
}


async function loadFavoriteMoviesData(
  args: FavoriteMoviesLoaderArgs
) {
  try {
    args.setFavoritesLoading(true);
    const movies = await fetchFavoriteMovies(
      args.favoriteIds
    );
    args.setFavoriteMovies(movies);
  } catch (error) {
    console.error(error);
    args.setFavoriteMovies([]);
  } finally {
    args.setFavoritesLoading(false);
  }
}

function clearFavoriteMovies(
  setFavoriteMovies: SetFavoriteMovies
) {
  setFavoriteMovies([]);
}

function useFavoriteMoviesState() {
  const [favoriteMovies, setFavoriteMovies] = useState<
    Movie[]
  >([]);
  const [favoritesLoading, setFavoritesLoading] =
    useState(false);
  const [removingFavoriteId, setRemovingFavoriteId] =
    useState<number | null>(null);

  return {
    favoriteMovies,
    setFavoriteMovies,
    favoritesLoading,
    setFavoritesLoading,
    removingFavoriteId,
    setRemovingFavoriteId,
  };
}

function useAccountPageState() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    "favorites"
  );
  return {
    activeTab,
    setActiveTab,
    ...useFavoriteMoviesState(),
  };
}

function syncFavoriteMovies({
  user,
  setFavoriteMovies,
  setFavoritesLoading,
}: FavoriteMoviesEffectArgs) {
  const favoriteIds = user
    ? normalizeFavoriteIds(user.favorites)
    : [];

  if (favoriteIds.length === 0) {
    clearFavoriteMovies(setFavoriteMovies);
    return;
  }

  void loadFavoriteMoviesData({
    favoriteIds,
    setFavoriteMovies,
    setFavoritesLoading,
  });
}

function useFavoriteMoviesEffect({
  user,
  setFavoriteMovies,
  setFavoritesLoading,
}: FavoriteMoviesEffectArgs) {
  useEffect(() => {
    syncFavoriteMovies({
      user,
      setFavoriteMovies,
      setFavoritesLoading,
    });
  }, [setFavoriteMovies, setFavoritesLoading, user]);
}

function createAccountUser(
  user: ReturnType<typeof useAuth>["user"],
  favoriteMovies: Movie[]
): AccountUser | null {
  if (!user) {
    return null;
  }

  return {
    firstName: user.name ?? "",
    lastName: user.surname ?? "",
    email: user.email,
    favorites: favoriteMovies,
  };
}

function getDisplayName(accountUser: AccountUser | null) {
  if (!accountUser) {
    return "";
  }

  return (
    [accountUser.firstName, accountUser.lastName]
      .filter(Boolean)
      .join(" ") || accountUser.email
  );
}

function useAccountUser(
  user: ReturnType<typeof useAuth>["user"],
  favoriteMovies: Movie[]
) {
  return useMemo(
    () => createAccountUser(user, favoriteMovies),
    [favoriteMovies, user]
  );
}

function useDisplayName(accountUser: AccountUser | null) {
  return useMemo(
    () => getDisplayName(accountUser),
    [accountUser]
  );
}

async function removeFavoriteMovie({
  movieId,
  refreshUser,
  setFavoriteMovies,
  setRemovingFavoriteId,
}: RemoveFavoriteArgs) {
  try {
    setRemovingFavoriteId(movieId);
    await removeFavorite(movieId);
    setFavoriteMovies((prev) =>
      prev.filter((movie) => movie.id !== movieId)
    );
    await refreshUser();
  } catch (error) {
    console.error(error);
  } finally {
    setRemovingFavoriteId(null);
  }
}

function createLogoutHandler({
  navigate,
  setUser,
}: LogoutArgs) {
  return async function handleLogout() {
    try {
      await logoutRequest();
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      navigate("/", { replace: true });
    }
  };
}

function createRemoveFavoriteHandler({
  refreshUser,
  setFavoriteMovies,
  setRemovingFavoriteId,
}: RemoveFavoriteHandlerArgs) {
  return async function handleRemoveFavorite(movieId: number) {
    await removeFavoriteMovie({
      movieId,
      refreshUser,
      setFavoriteMovies,
      setRemovingFavoriteId,
    });
  };
}

function createAccountPageActions(
  args: AccountPageActionsArgs
) {
  return {
    logout: createLogoutHandler(args),
    removeFavorite: createRemoveFavoriteHandler(args),
  };
}

function createAccountPageControllerValue({
  loading,
  pageState,
  accountUser,
  displayName,
  logout,
  removeFavorite,
}: AccountPageControllerValueArgs) {
  return {
    loading: loading || pageState.favoritesLoading,
    user: accountUser,
    activeTab: pageState.activeTab,
    setActiveTab: pageState.setActiveTab,
    displayName,
    logout,
    removeFavorite,
    removingFavoriteId: pageState.removingFavoriteId,
  };
}

function useAccountPageContext(): AccountPageContext {
  const navigate = useNavigate();
  const { loading, user, setUser, refreshUser } =
    useAuth();
  const pageState = useAccountPageState();

  return {
    navigate,
    loading,
    user,
    setUser,
    refreshUser,
    pageState,
    setFavoriteMovies: pageState.setFavoriteMovies,
    setRemovingFavoriteId: pageState.setRemovingFavoriteId,
  };
}

function useAccountPageFavoriteMovies(
  user: ReturnType<typeof useAuth>["user"],
  pageState: ReturnType<typeof useAccountPageState>
) {
  useFavoriteMoviesEffect({
    user,
    setFavoriteMovies: pageState.setFavoriteMovies,
    setFavoritesLoading: pageState.setFavoritesLoading,
  });
}

function useAccountPageData() {
  const context = useAccountPageContext();
  useAccountPageFavoriteMovies(
    context.user,
    context.pageState
  );
  const accountUser = useAccountUser(
    context.user,
    context.pageState.favoriteMovies
  );
  const displayName = useDisplayName(accountUser);
  return { context, accountUser, displayName };
}

export function useAccountPageController() {
  const { context, accountUser, displayName } =
    useAccountPageData();
  return createAccountPageControllerValue({
    loading: context.loading,
    pageState: context.pageState,
    accountUser,
    displayName,
    ...createAccountPageActions(context),
  });
}
