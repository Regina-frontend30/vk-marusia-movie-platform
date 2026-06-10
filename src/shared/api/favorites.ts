import { ApiError } from "./auth";

const BASE_URL = "https://cinemaguide.skillbox.cc";

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
    const message =
      (await readErrorText(response)) ||
      "Ошибка работы с избранным";

    throw new ApiError({
      message,
      status: response.status,
      data: null,
    });
  }
}

export async function addFavorite(
  movieId: number
) {
  const attempts: RequestInit[] = [
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: movieId }),
    },
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId }),
    },
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        id: String(movieId),
      }),
    },
  ];

  let lastError: unknown = null;

  for (const attempt of attempts) {
    try {
      await requestFavorite(
        `${BASE_URL}/favorites`,
        attempt
      );
      return;
    } catch (error) {
      lastError = error;

      if (
        error instanceof ApiError &&
        error.status !== 400 &&
        error.status !== 404 &&
        error.status !== 405
      ) {
        throw error;
      }
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
