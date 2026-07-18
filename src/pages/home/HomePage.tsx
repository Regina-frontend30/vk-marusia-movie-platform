import { useEffect, useState } from "react";
import Hero from "../../widgets/hero/Hero";
import TopMovies from "../../widgets/top-movies/TopMovies";
import { getRandomMovie, getTopMovies } from "../../shared/api/movies";
import type { Movie } from "../../shared/types/movie";

type HomePageLoaders = {
  setFeaturedMovie: (movie: Movie | null) => void;
  setTopMovies: (movies: Movie[]) => void;
  setLoading: (loading: boolean) => void;
  setFeaturedError: (hasError: boolean) => void;
};

async function loadRandomFeaturedMovie(
  args: Pick<HomePageLoaders, "setFeaturedMovie" | "setFeaturedError">
) {
  try {
    args.setFeaturedMovie(await getRandomMovie());
    args.setFeaturedError(false);
  } catch (error) {
    console.error(error);
    args.setFeaturedMovie(null);
    args.setFeaturedError(true);
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
  setFeaturedMovie: (movie: Movie | null) => void;
  setTopMovies: (movies: Movie[]) => void;
  setLoading: (loading: boolean) => void;
  setFeaturedError: (hasError: boolean) => void;
}) {
  try {
    await Promise.all([
      loadRandomFeaturedMovie(args),
      loadTopMoviesList(args.setTopMovies),
    ]);
  } finally {
    args.setLoading(false);
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

function HomePageFallback({ topMovies }: { topMovies: Movie[] }) {
  return (
    <div className="container">
      <div>Не удалось загрузить главный фильм</div>
      {topMovies.length > 0 ? <TopMovies movies={topMovies} /> : null}
    </div>
  );
}

export default function HomePage() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFeaturedError, setFeaturedError] = useState(false);
  const refreshFeaturedMovie = () =>
    loadRandomFeaturedMovie({ setFeaturedMovie, setFeaturedError });

  useEffect(() => {
    void loadHomePageData({
      setFeaturedMovie,
      setTopMovies,
      setLoading,
      setFeaturedError,
    });
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (!featuredMovie && hasFeaturedError) {
    return <HomePageFallback topMovies={topMovies} />;
  }
  if (!featuredMovie) return <div>Загрузка...</div>;

  return <HomePageContent featuredMovie={featuredMovie} topMovies={topMovies} onRefresh={refreshFeaturedMovie} />;
}
