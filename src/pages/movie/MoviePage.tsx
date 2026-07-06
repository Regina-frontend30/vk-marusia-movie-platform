import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie } from "../../shared/types/movie";
import "./MoviePage.scss";
import spriteUrl from "../../assets/sprite/sprite.svg";
import AuthModal from "../../features/auth/AuthModal";
import TrailerModal from "../../shared/ui/trailer-modal/TrailerModal";
import { useFavoriteToggle } from "../../hooks/useFavoriteToggle";

const BASE_URL = "https://cinemaguide.skillbox.cc";

type MoviePageData = {
  loading: boolean;
  movieDetails: Movie | null;
};

async function loadMovieDetailsData(id: string | undefined) {
  const response = await fetch(`${BASE_URL}/movie/${id}`);
  return response.json();
}

async function loadMoviePageState(args: {
  id: string | undefined;
  setMovieDetails: React.Dispatch<React.SetStateAction<Movie | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  try {
    args.setMovieDetails(await loadMovieDetailsData(args.id));
  } catch (error) {
    console.error(error);
  } finally {
    args.setLoading(false);
  }
}

function MoviePageLoader() {
  return <div className="container">Загрузка...</div>;
}

function MoviePageNotFound() {
  return <div className="container">Фильм не найден</div>;
}

function MoviePageMeta({ movieDetails }: { movieDetails: Movie }) {
  return (
    <div className="movie-page__meta">
      <span className="movie-page__rating">★ {movieDetails.tmdbRating}</span>
      <span className="movie-page__year">{movieDetails.releaseYear}</span>
      <span className="movie-page__genres">{movieDetails.genres?.[0]}</span>
      <span className="movie-page__runtime">{movieDetails.runtime} мин</span>
    </div>
  );
}

function MoviePageFavoriteButton({
  favoriteController,
}: {
  favoriteController: ReturnType<typeof useFavoriteToggle>;
}) {
  return (
    <button type="button" className={`movie-page__icon-btn ${favoriteController.isFavorite ? "movie-page__icon-btn--active" : ""}`} disabled={favoriteController.disabled} onClick={favoriteController.toggleFavorite}>
      <svg className="movie-page__icon">
        <use href={`${spriteUrl}#${favoriteController.isFavorite ? "icon-favorites-filled" : "icon-favorites"}`} />
      </svg>
    </button>
  );
}

function MoviePageActions({
  hasTrailer,
  favoriteController,
  onOpenTrailer,
}: {
  hasTrailer: boolean;
  favoriteController: ReturnType<typeof useFavoriteToggle>;
  onOpenTrailer: () => void;
}) {
  return (
    <div className="movie-page__actions">
      <button type="button" className="movie-page__button movie-page__button--primary" onClick={onOpenTrailer} disabled={!hasTrailer}>Трейлер</button>
      <MoviePageFavoriteButton favoriteController={favoriteController} />
    </div>
  );
}

function MoviePageAbout({ movieDetails }: { movieDetails: Movie }) {
  return (
    <div className="movie-page__about">
      <h2 className="movie-page__about-title">О фильме</h2>
      <div className="movie-page__about-rows">
        <div className="movie-page__about-row"><span>Год</span><span>{movieDetails.releaseYear}</span></div>
        <div className="movie-page__about-row"><span>Жанр</span><span>{movieDetails.genres?.join(", ")}</span></div>
        <div className="movie-page__about-row"><span>Длительность</span><span>{movieDetails.runtime} мин</span></div>
      </div>
    </div>
  );
}

function MoviePageContent({
  movieDetails,
  hasTrailer,
  favoriteController,
  onOpenTrailer,
}: {
  movieDetails: Movie;
  hasTrailer: boolean;
  favoriteController: ReturnType<typeof useFavoriteToggle>;
  onOpenTrailer: () => void;
}) {
  return (
    <section className="movie-page container">
      <div className="movie-page__hero">
        <div className="movie-page__info">
          <MoviePageMeta movieDetails={movieDetails} />
          <h1 className="movie-page__title">{movieDetails.title}</h1>
          <p className="movie-page__plot">{movieDetails.plot}</p>
          <MoviePageActions hasTrailer={hasTrailer} favoriteController={favoriteController} onOpenTrailer={onOpenTrailer} />
        </div>
        <img className="movie-page__image" src={movieDetails.backdropUrl} alt={movieDetails.title} />
      </div>
      <MoviePageAbout movieDetails={movieDetails} />
    </section>
  );
}

function MoviePageTrailerModal({
  isOpen,
  hasTrailer,
  movieDetails,
  onClose,
}: {
  isOpen: boolean;
  hasTrailer: boolean;
  movieDetails: Movie;
  onClose: () => void;
}) {
  if (!isOpen || !hasTrailer) {
    return null;
  }

  return <TrailerModal title={movieDetails.title} trailerUrl={movieDetails.trailerUrl} trailerYouTubeId={movieDetails.trailerYouTubeId} onClose={onClose} />;
}

function useMoviePageData(): MoviePageData {
  const { id } = useParams<{ id: string }>();
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadMoviePageState({ id, setMovieDetails, setLoading });
  }, [id]);

  return { loading, movieDetails };
}

function MoviePageLoaded({ movieDetails }: { movieDetails: Movie }) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const favoriteController = useFavoriteToggle(movieDetails.id);
  const hasTrailer = Boolean(movieDetails.trailerYouTubeId || movieDetails.trailerUrl);

  return (
    <>
      <MoviePageContent movieDetails={movieDetails} hasTrailer={hasTrailer} favoriteController={favoriteController} onOpenTrailer={() => setIsTrailerOpen(true)} />
      <MoviePageTrailerModal isOpen={isTrailerOpen} hasTrailer={hasTrailer} movieDetails={movieDetails} onClose={() => setIsTrailerOpen(false)} />
      {favoriteController.isAuthOpen ? <AuthModal onClose={favoriteController.closeAuth} /> : null}
    </>
  );
}

export default function MoviePage() {
  const { loading, movieDetails } = useMoviePageData();
  if (loading) return <MoviePageLoader />;
  if (!movieDetails) return <MoviePageNotFound />;
  return <MoviePageLoaded movieDetails={movieDetails} />;
}
