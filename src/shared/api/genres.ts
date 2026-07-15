import type { Genre } from "../types/genre";

const BASE_URL = "https://cinemaguide.skillbox.cc";

export async function getGenres(): Promise<Genre[]> {
    const response = await fetch(
        `${BASE_URL}/movie/genres`,
        { credentials: "include" }
    );

    if (!response.ok) {
        throw new Error("Ошибка загрузки жанров");
    }

    const genreNames: string[] = await response.json();

    return genreNames.map((name) => ({
        name,
    }));
}
