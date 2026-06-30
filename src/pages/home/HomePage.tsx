import { useEffect, useState } from "react";
import Hero from "../../widgets/hero/Hero";
import TopMovies from "../../widgets/top-movies/TopMovies";
import { getRandomMovie, getTopMovies } from "../../shared/api/movies";
import type { Movie } from "../../shared/types/movie";

async function loadFeaturedMovie(setFeaturedMovie: (movie: Movie) => void) {
  try {
    const randomMovie = await getRandomMovie();
    setFeaturedMovie(randomMovie);
  } catch (error) {
    console.error(error);
  }
}

async function loadTopMoviesList(setTopMovies: (movies: Movie[]) => void) {
  try {
    const topMoviesList = await getTopMovies();
    setTopMovies(topMoviesList);
  } catch (error) {
    console.error(error);
  }
}

function HomePageContent({
  featuredMovie,
  topMovies,
  onRefresh,
}: {
  featuredMovie: Movie;
  topMovies: Movie[];
  onRefresh: () => Promise<void>;
}) {
  return (
    <>
      <Hero movie={featuredMovie} onRefresh={onRefresh} />
      <TopMovies movies={topMovies} />
    </>
  );
}

export default function HomePage() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);

  const loadRandomMovie = () => loadFeaturedMovie(setFeaturedMovie);
  const loadTopMovies = () => loadTopMoviesList(setTopMovies);

  useEffect(() => {
    queueMicrotask(() => {
      void loadRandomMovie();
      void loadTopMovies();
    });
  }, []);

  if (!featuredMovie) return <div>Загрузка...</div>;

  return <HomePageContent featuredMovie={featuredMovie} topMovies={topMovies} onRefresh={loadRandomMovie} />;
}
