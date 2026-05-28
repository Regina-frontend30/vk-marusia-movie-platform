const BASE_URL = "https://cinemaguide.skillbox.cc";

import type { Movie } from "../types/movie";

type Genre = {
    name: string;
    imageUrl: string;
};

export async function getGenres(): Promise<Genre[]> {
    const genresRes = await fetch(
        `${BASE_URL}/movie/genres`
    );

    if (!genresRes.ok) {
        throw new Error("Ошибка загрузки жанров");
    }

    const genres: string[] = await genresRes.json();

    const genresWithImages = await Promise.all(
        genres.map(async (genre) => {
            try {
                const moviesRes = await fetch(
                    `${BASE_URL}/movie?genre=${encodeURIComponent(genre)}`
                );

                if (!moviesRes.ok) {
                    throw new Error();
                }

                const moviesData =
                    (await moviesRes.json()) as Movie[];

                const firstMovie = moviesData[0];

                return {
                    name: genre,
                    imageUrl: firstMovie?.posterUrl || "",
                };
            } catch {
                return {
                    name: genre,
                    imageUrl: "",
                };
            }
        })
    );

    return genresWithImages;
}
