import { useEffect, useState } from "react";
import Hero from "../../widgets/hero/Hero";
import TopMovies from "../../widgets/top-movies/TopMovies";
import { getRandomMovie, getTopMovies } from "../../shared/api/movies";
import type { Movie } from "../../shared/types/movie";

export default function HomePage() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);

  const loadRandomMovie = async () => {
    try {
      const randomMovie = await getRandomMovie();
      setFeaturedMovie(randomMovie);
    } catch (error) {
      console.error(error);
    }
  };

  const loadTopMovies = async () => {
    try {
      const topMoviesList = await getTopMovies();
      setTopMovies(topMoviesList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void loadRandomMovie();
      void loadTopMovies();
    });
  }, []);

  if (!featuredMovie) return <div>Загрузка...</div>;

  return (
    <>
      <Hero movie={featuredMovie} onRefresh={loadRandomMovie} />
      <TopMovies movies={topMovies} />
    </>
  );
}
