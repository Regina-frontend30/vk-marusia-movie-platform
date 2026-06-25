import { ApiError } from "./auth";

const BASE_URL = "https://cinemaguide.skillbox.cc";

const RETRYABLE_FAVORITE_ERROR_STATUSES = [400, 404, 405];

async function readErrorText(response: Response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

async function requestFavorite(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const response = await fetch(input, {
    credentials: "include",
    ...init,
  });

  if (!response.ok) {
    await throwFavoriteError(response);
  }
}

async function throwFavoriteError(response: Response): Promise<never> {
  const message =
    (await readErrorText(response)) ||
    "Ошибка работы с избранным";

  throw new ApiError({
    message,
    status: response.status,
    data: null,
  });
}

function createJsonFavoriteAttempt(
  body: Record<string, number>
): RequestInit {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function createFormFavoriteAttempt(movieId: number): RequestInit {
  return {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      id: String(movieId),
    }),
  };
}

function createFavoriteAttempts(movieId: number): RequestInit[] {
  return [
    createJsonFavoriteAttempt({ id: movieId }),
    createJsonFavoriteAttempt({ movieId }),
    createFormFavoriteAttempt(movieId),
  ];
}

function shouldThrowFavoriteError(error: unknown) {
  return (
    error instanceof ApiError &&
    !RETRYABLE_FAVORITE_ERROR_STATUSES.includes(error.status)
  );
}

async function tryAddFavoriteAttempt(
  attempt: RequestInit
): Promise<unknown> {
  try {
    await requestFavorite(
      `${BASE_URL}/favorites`,
      attempt
    );
    return null;
  } catch (error) {
    if (shouldThrowFavoriteError(error)) {
      throw error;
    }

    return error;
  }
}

export async function addFavorite(
  movieId: number
) {
  const attempts = createFavoriteAttempts(movieId);
  let lastError: unknown = null;

  for (const attempt of attempts) {
    lastError = await tryAddFavoriteAttempt(attempt);
    if (!lastError) {
      return;
    }
  }

  throw lastError;
}

export async function removeFavorite(
  movieId: number
) {
  await requestFavorite(
    `${BASE_URL}/favorites/${movieId}`,
    {
      method: "DELETE",
    }
  );
}
