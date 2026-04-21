export type Movie = {
    id: number;
    title: string;
    plot: string;
    releaseYear: number;
    tmdbRating: number;
    genres: string[];
    runtime: number;
    posterUrl: string;
    backdropUrl: string;
};