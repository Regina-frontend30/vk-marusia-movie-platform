import { useEffect, useState } from "react";
import Hero from "../../widgets/hero/Hero";
import TopMovies from "../../widgets/top-movies/TopMovies";
import { getRandomMovie, getTopMovies } from "../../shared/api/movies";
import type { Movie } from "../../shared/types/movie";

export default function HomePage() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);

  const loadRandom = async () => {
    try {
      const data = await getRandomMovie();
      setMovie(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadTop = async () => {
    try {
      const data = await getTopMovies();
      setTopMovies(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void loadRandom();
      void loadTop();
    });
  }, []);

  if (!movie) return <div>Загрузка...</div>;

  return (
    <>
      <Hero movie={movie} onRefresh={loadRandom} />
      <TopMovies movies={topMovies} />
    </>
  );
}
