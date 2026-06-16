import type { Movie } from "../types/movie";

const BASE_URL = "https://cinemaguide.skillbox.cc";

export async function getRandomMovie() {
    const response = await fetch(`${BASE_URL}/movie/random`);

    if (!response.ok) {
        throw new Error("Ошибка загрузки фильма");
    }

    return response.json();
}

export async function getTopMovies() {
    const response = await fetch(`${BASE_URL}/movie/top10`);

    if (!response.ok) {
        throw new Error("Ошибка загрузки топа");
    }

    return response.json();
}

export async function getMovieById(
    id: string | number
): Promise<Movie> {
    const response = await fetch(`${BASE_URL}/movie/${id}`);

    if (!response.ok) {
        throw new Error("Ошибка загрузки фильма");
    }

    return response.json() as Promise<Movie>;
}

export async function getMoviesByGenre(
    genre: string
): Promise<Movie[]> {
    const response = await fetch(
        `${BASE_URL}/movie?genre=${encodeURIComponent(genre)}`
    );

    if (!response.ok) {
        throw new Error("Ошибка загрузки фильмов");
    }

    return response.json() as Promise<Movie[]>;
}

export async function searchMovies(
    query: string,
    signal?: AbortSignal
): Promise<Movie[]> {
    const response = await fetch(
        `${BASE_URL}/movie?title=${encodeURIComponent(query)}`,
        { signal }
    );

    if (!response.ok) {
        throw new Error("Ошибка поиска");
    }

    return response.json() as Promise<Movie[]>;
}
