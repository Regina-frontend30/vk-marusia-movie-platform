import { useMemo, useState } from "react";

import { useAuth } from "../app/providers/useAuth";
import {
  addFavorite,
  removeFavorite,
} from "../shared/api/favorites";

type SetLoading = React.Dispatch<
  React.SetStateAction<boolean>
>;

type SetAuthOpen = React.Dispatch<
  React.SetStateAction<boolean>
>;

type ToggleFavoriteArgs = {
  user: ReturnType<typeof useAuth>["user"];
  movieId: number | null;
  loading: boolean;
  isFavorite: boolean;
  refreshUser: () => Promise<void>;
  setLoading: SetLoading;
  setIsAuthOpen: SetAuthOpen;
};

type FavoriteToggleValueArgs = {
  movieId: number | null;
  loading: boolean;
  user: ReturnType<typeof useAuth>["user"];
  isFavorite: boolean;
  isAuthOpen: boolean;
  toggleFavorite: () => Promise<void>;
  closeAuth: () => void;
};

type FavoriteToggleState = {
  loading: boolean;
  setLoading: SetLoading;
  isAuthOpen: boolean;
  setIsAuthOpen: SetAuthOpen;
};

type FavoriteToggleData = {
  user: ReturnType<typeof useAuth>["user"];
  refreshUser: () => Promise<void>;
  favoriteToggleState: FavoriteToggleState;
  isFavorite: boolean;
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
) {
  if (!Array.isArray(favorites)) {
    return [];
  }

  return favorites
    .map(getFavoriteId)
    .filter((favoriteId): favoriteId is string =>
      Boolean(favoriteId)
    );
}

async function updateFavoriteMovie(args: {
  movieId: number;
  isFavorite: boolean;
  refreshUser: () => Promise<void>;
}) {
  if (args.isFavorite) {
    await removeFavorite(args.movieId);
  } else {
    await addFavorite(args.movieId);
  }

  await args.refreshUser();
}

function openFavoriteAuthIfNeeded(
  args: Pick<ToggleFavoriteArgs, "user" | "setIsAuthOpen">
) {
  if (args.user) {
    return false;
  }

  args.setIsAuthOpen(true);
  return true;
}

async function toggleFavoriteMovie(args: ToggleFavoriteArgs) {
  const movieId = args.movieId;
  if (openFavoriteAuthIfNeeded(args)) return;
  if (movieId === null || args.loading) return;

  try {
    args.setLoading(true);
    await updateFavoriteMovie({
      movieId,
      isFavorite: args.isFavorite,
      refreshUser: args.refreshUser,
    });
  } catch (error) {
    console.error(error);
  } finally {
    args.setLoading(false);
  }
}

function createFavoriteToggleValue({
  movieId,
  loading,
  user,
  isFavorite,
  isAuthOpen,
  toggleFavorite,
  closeAuth,
}: FavoriteToggleValueArgs) {
  return {
    isFavorite,
    isAuthorized: Boolean(user),
    isAuthOpen,
    loading,
    disabled: movieId === null || loading,
    closeAuth,
    toggleFavorite,
  };
}

function useFavoriteToggleState(): FavoriteToggleState {
  const [loading, setLoading] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return {
    loading,
    setLoading,
    isAuthOpen,
    setIsAuthOpen,
  };
}

function useFavoriteStatus(
  movieId: number | null,
  favorites: unknown
) {
  const favoriteIds = useMemo(
    () => normalizeFavoriteIds(favorites),
    [favorites]
  );

  return Boolean(
    movieId !== null &&
      favoriteIds.includes(String(movieId))
  );
}

function useFavoriteToggleData(
  movieId: number | null
): FavoriteToggleData {
  const { user, refreshUser } = useAuth();
  const favoriteToggleState = useFavoriteToggleState();
  const isFavorite = useFavoriteStatus(
    movieId,
    user?.favorites
  );

  return {
    user,
    refreshUser,
    favoriteToggleState,
    isFavorite,
  };
}

function createToggleFavoriteHandler(args: {
  user: ReturnType<typeof useAuth>["user"];
  movieId: number | null;
  loading: boolean;
  isFavorite: boolean;
  refreshUser: () => Promise<void>;
  setLoading: SetLoading;
  setIsAuthOpen: SetAuthOpen;
}) {
  return async function toggleFavorite() {
    await toggleFavoriteMovie(args);
  };
}

function createToggleFavoriteArgs(
  movieId: number | null,
  favoriteToggleData: FavoriteToggleData
) {
  return {
    user: favoriteToggleData.user,
    movieId,
    loading: favoriteToggleData.favoriteToggleState.loading,
    isFavorite: favoriteToggleData.isFavorite,
    refreshUser: favoriteToggleData.refreshUser,
    setLoading: favoriteToggleData.favoriteToggleState.setLoading,
    setIsAuthOpen:
      favoriteToggleData.favoriteToggleState.setIsAuthOpen,
  };
}

function createCloseAuthHandler(setIsAuthOpen: SetAuthOpen) {
  return () => setIsAuthOpen(false);
}

function createFavoriteToggleControllerValue(
  movieId: number | null,
  favoriteToggleData: FavoriteToggleData
) {
  const toggleFavorite = createToggleFavoriteHandler(
    createToggleFavoriteArgs(movieId, favoriteToggleData)
  );
  return createFavoriteToggleValue({
    movieId,
    loading: favoriteToggleData.favoriteToggleState.loading,
    user: favoriteToggleData.user,
    isFavorite: favoriteToggleData.isFavorite,
    isAuthOpen:
      favoriteToggleData.favoriteToggleState.isAuthOpen,
    toggleFavorite,
    closeAuth: createCloseAuthHandler(
      favoriteToggleData.favoriteToggleState.setIsAuthOpen
    ),
  });
}

export function useFavoriteToggle(
  movieId: number | null
) {
  const favoriteToggleData = useFavoriteToggleData(movieId);
  return createFavoriteToggleControllerValue(
    movieId,
    favoriteToggleData
  );
}
