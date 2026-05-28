import { useEffect, useMemo, useState } from "react";

import { getGenres } from "../shared/api/genres";
import { getMoviesByGenre } from "../shared/api/movies";

import type { Genre } from "../shared/types/genre";
import type { Movie } from "../shared/types/movie";

type GenreCard = {
    name: string;
    imageUrl: string | null;
};

function normalizeMoviesResponse(response: unknown): Movie[] {
    if (Array.isArray(response)) {
        return response as Movie[];
    }

    if (!response || typeof response !== "object") {
        return [];
    }

    const responseObject = response as {
        movies?: unknown;
        results?: unknown;
    };

    if (Array.isArray(responseObject.movies)) {
        return responseObject.movies as Movie[];
    }

    if (Array.isArray(responseObject.results)) {
        return responseObject.results as Movie[];
    }

    return [];
}

async function buildGenreCard(name: string): Promise<GenreCard> {
    try {
        const response = await getMoviesByGenre(name);

        const movies = normalizeMoviesResponse(response);

        const movieWithBackdrop = movies.find(
            (movie) => Boolean(movie.backdropUrl)
        );

        const imageUrl =
            movieWithBackdrop?.backdropUrl ??
            movies[0]?.backdropUrl ??
            movies[0]?.posterUrl ??
            null;

        return {
            name,
            imageUrl,
        };
    } catch (error) {
        console.error(error);

        return {
            name,
            imageUrl: null,
        };
    }
}

function decodeGenreParam(genre?: string) {
    return genre ? decodeURIComponent(genre) : null;
}

export function useGenresPage(genreParam?: string) {
    const moviesPageSize = 10;

    const genreName = useMemo(
        () => decodeGenreParam(genreParam),
        [genreParam]
    );

    const [genres, setGenres] = useState<GenreCard[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);

    const [loading, setLoading] = useState(true);
    const [moviesLoading, setMoviesLoading] = useState(false);

    const [visibleCount, setVisibleCount] =
        useState(moviesPageSize);

    useEffect(() => {
        async function loadGenres() {
            try {
                const genreList: Genre[] =
                    await getGenres();

                setGenres(
                    await Promise.all(
                        genreList.map((genre) =>
                            buildGenreCard(genre.name)
                        )
                    )
                );
            } catch (error) {
                console.error(error);
                setGenres([]);
            } finally {
                setLoading(false);
            }
        }

        void loadGenres();
    }, []);

    useEffect(() => {
        async function loadMovies() {
            if (!genreName) {
                return;
            }

            try {
                setMoviesLoading(true);

                const response =
                    await getMoviesByGenre(genreName);

                const list =
                    normalizeMoviesResponse(response);

                setMovies(
                    list
                        .slice()
                        .sort(
                            (leftMovie, rightMovie) =>
                                (rightMovie.tmdbRating ?? 0) -
                                (leftMovie.tmdbRating ?? 0)
                        )
                );

                setVisibleCount(moviesPageSize);
            } catch (error) {
                console.error(error);
                setMovies([]);
            } finally {
                setMoviesLoading(false);
            }
        }

        void loadMovies();
    }, [genreName]);

    const visibleMovies = useMemo(
        () => movies.slice(0, visibleCount),
        [movies, visibleCount]
    );

    const canShowMore =
        visibleCount < movies.length;

    function showMore() {
        setVisibleCount((count) =>
            Math.min(
                count + moviesPageSize,
                movies.length
            )
        );
    }

    return {
        canShowMore,
        genreName,
        genres,
        loading,
        moviesLoading,
        showMore,
        visibleMovies,
    };
}