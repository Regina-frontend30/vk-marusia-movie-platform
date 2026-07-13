import { useEffect, useState } from "react";
import Hero from "../../widgets/hero/Hero";
import TopMovies from "../../widgets/top-movies/TopMovies";
import { getRandomMovie, getTopMovies } from "../../shared/api/movies";
import type { Movie } from "../../shared/types/movie";

async function loadRandomFeaturedMovie(
  setFeaturedMovie: (movie: Movie) => void
) {
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

async function loadHomePageData(args: {
  setFeaturedMovie: (movie: Movie) => void;
  setTopMovies: (movies: Movie[]) => void;
}) {
  await Promise.all([
    loadRandomFeaturedMovie(args.setFeaturedMovie),
    loadTopMoviesList(args.setTopMovies),
  ]);
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
  const refreshFeaturedMovie = () => loadRandomFeaturedMovie(setFeaturedMovie);

  useEffect(() => {
    void loadHomePageData({ setFeaturedMovie, setTopMovies });
  }, []);

  if (!featuredMovie) return <div>Загрузка...</div>;

  return <HomePageContent featuredMovie={featuredMovie} topMovies={topMovies} onRefresh={refreshFeaturedMovie} />;
}
