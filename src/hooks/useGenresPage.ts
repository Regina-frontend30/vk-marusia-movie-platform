import { useEffect, useMemo, useState } from "react";

import { getGenres } from "../shared/api/genres";
import { getMoviesByGenre } from "../shared/api/movies";

import type { Genre } from "../shared/types/genre";
import type { Movie } from "../shared/types/movie";

type GenreCard = {
    name: string;
    imageUrl: string | null;
};

type GenreMoviesEffectArgs = {
    genreName: string | null;
    moviesPageSize: number;
    setMovies: (movies: Movie[]) => void;
    setMoviesLoading: (loading: boolean) => void;
    setVisibleCount: (count: number) => void;
};

function getMovieArray(value: unknown): Movie[] | null {
    return Array.isArray(value)
        ? (value as Movie[])
        : null;
}

function normalizeMoviesResponse(response: unknown): Movie[] {
    const responseMovies = getMovieArray(response);
    if (responseMovies) return responseMovies;
    if (!response || typeof response !== "object") return [];
    const responseObject = response as {
        movies?: unknown;
        results?: unknown;
    };
    return getMovieArray(responseObject.movies)
        ?? getMovieArray(responseObject.results)
        ?? [];
}

function selectGenreImageUrl(movies: Movie[]) {
    const movieWithBackdrop = movies.find(
        (movie) => Boolean(movie.backdropUrl)
    );

    return (
        movieWithBackdrop?.backdropUrl ??
        movies[0]?.backdropUrl ??
        movies[0]?.posterUrl ??
        null
    );
}

async function buildGenreCard(name: string): Promise<GenreCard> {
    try {
        const response = await getMoviesByGenre(name);
        const movies = normalizeMoviesResponse(response);
        return {
            name,
            imageUrl: selectGenreImageUrl(movies),
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

async function loadGenreMovies(genreName: string) {
    const response = await getMoviesByGenre(genreName);
    const movies = normalizeMoviesResponse(response);
    return movies
        .slice()
        .sort(
            (leftMovie, rightMovie) =>
                (rightMovie.tmdbRating ?? 0) -
                (leftMovie.tmdbRating ?? 0)
        );
}

async function loadGenreCards() {
    const genreList: Genre[] = await getGenres();
    return Promise.all(
        genreList.map((genre) =>
            buildGenreCard(genre.name)
        )
    );
}

function createShowMoreHandler(args: {
    moviesLength: number;
    moviesPageSize: number;
    setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
}) {
    return function showMore() {
        args.setVisibleCount((count) =>
            Math.min(
                count + args.moviesPageSize,
                args.moviesLength
            )
        );
    };
}

async function loadGenreMoviesState(args: {
    genreName: string;
    moviesPageSize: number;
    setMovies: (movies: Movie[]) => void;
    setMoviesLoading: (loading: boolean) => void;
    setVisibleCount: (count: number) => void;
}) {
    try {
        args.setMoviesLoading(true);
        args.setMovies(await loadGenreMovies(args.genreName));
        args.setVisibleCount(args.moviesPageSize);
    } catch (error) {
        console.error(error);
        args.setMovies([]);
    } finally {
        args.setMoviesLoading(false);
    }
}

async function loadGenresState(args: {
    setGenres: (genres: GenreCard[]) => void;
    setLoading: (loading: boolean) => void;
}) {
    try {
        args.setGenres(await loadGenreCards());
    } catch (error) {
        console.error(error);
        args.setGenres([]);
    } finally {
        args.setLoading(false);
    }
}

function useGenresData({
    setGenres,
    setLoading,
}: {
    setGenres: (genres: GenreCard[]) => void;
    setLoading: (loading: boolean) => void;
}) {
    useEffect(() => {
        void loadGenresState({ setGenres, setLoading });
    }, [setGenres, setLoading]);
}

function useGenreMoviesEffect({
    genreName,
    moviesPageSize,
    setMovies,
    setMoviesLoading,
    setVisibleCount,
}: GenreMoviesEffectArgs) {
    useEffect(() => {
        if (!genreName) return;
        void loadGenreMoviesState({
            genreName,
            moviesPageSize,
            setMovies,
            setMoviesLoading,
            setVisibleCount,
        });
    }, [genreName, moviesPageSize, setMovies, setMoviesLoading, setVisibleCount]);
}

function useGenresPageState(moviesPageSize: number) {
    const [genres, setGenres] = useState<GenreCard[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [moviesLoading, setMoviesLoading] = useState(false);
    const [visibleCount, setVisibleCount] =
        useState(moviesPageSize);
    const visibleMovies = useMemo(
        () => movies.slice(0, visibleCount),
        [movies, visibleCount]
    );
    const showMore = createShowMoreHandler({
        moviesLength: movies.length,
        moviesPageSize,
        setVisibleCount,
    });
    return { genres, setGenres, movies, setMovies, loading, setLoading, moviesLoading, setMoviesLoading, visibleCount, setVisibleCount, visibleMovies, canShowMore: visibleCount < movies.length, showMore };
}

export function useGenresPage(genreParam?: string) {
    const moviesPageSize = 10;
    const genreName = useMemo(
        () => decodeGenreParam(genreParam),
        [genreParam]
    );
    const pageState = useGenresPageState(moviesPageSize);
    useGenresData({ setGenres: pageState.setGenres, setLoading: pageState.setLoading });
    useGenreMoviesEffect({ genreName, moviesPageSize, setMovies: pageState.setMovies, setMoviesLoading: pageState.setMoviesLoading, setVisibleCount: pageState.setVisibleCount });
    return { canShowMore: pageState.canShowMore, genreName, genres: pageState.genres, loading: pageState.loading, moviesLoading: pageState.moviesLoading, showMore: pageState.showMore, visibleMovies: pageState.visibleMovies };
}
