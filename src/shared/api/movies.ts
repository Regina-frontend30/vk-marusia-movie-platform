import type { Movie } from "../types/movie";

const BASE_URL = "https://cinemaguide.skillbox.cc";

export async function getRandomMovie() {
    const res = await fetch(`${BASE_URL}/movie/random`);

    if (!res.ok) {
        throw new Error("Ошибка загрузки фильма");
    }

    return res.json();
}

export async function getTopMovies() {
    const res = await fetch(`${BASE_URL}/movie/top10`);

    if (!res.ok) {
        throw new Error("Ошибка загрузки топа");
    }

    return res.json();
}

export async function getMoviesByGenre(
    genre: string
): Promise<Movie[]> {
    const res = await fetch(
        `${BASE_URL}/movie?genre=${encodeURIComponent(genre)}`
    );

    if (!res.ok) {
        throw new Error("Ошибка загрузки фильмов");
    }

    return res.json() as Promise<Movie[]>;
}

export async function searchMovies(
    query: string,
    signal?: AbortSignal
): Promise<Movie[]> {
    const res = await fetch(
        `${BASE_URL}/movie?title=${encodeURIComponent(query)}`,
        { signal }
    );

    if (!res.ok) {
        throw new Error("Ошибка поиска");
    }

    return res.json() as Promise<Movie[]>;
}