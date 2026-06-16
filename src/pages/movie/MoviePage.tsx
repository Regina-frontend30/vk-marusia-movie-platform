import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie } from "../../shared/types/movie";
import "./MoviePage.scss";
import spriteUrl from "../../assets/sprite/sprite.svg";
import AuthModal from "../../features/auth/AuthModal";
import TrailerModal from "../../shared/ui/trailer-modal/TrailerModal";
import { useFavoriteToggle } from "../../hooks/useFavoriteToggle";

const BASE_URL = "https://cinemaguide.skillbox.cc";

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();

  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const favoriteController = useFavoriteToggle(movieDetails?.id ?? null);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/movie/${id}`);
        const movieData = await response.json();
        setMovieDetails(movieData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [id]);

  if (loading) {
    return <div className="container">Загрузка...</div>;
  }

  if (!movieDetails) {
    return <div className="container">Фильм не найден</div>;
  }

  const hasTrailer = Boolean(
    movieDetails.trailerYouTubeId || movieDetails.trailerUrl
  );

  return (
    <>
      <section className="movie-page container">
        <div className="movie-page__hero">
          <div className="movie-page__info">
            <div className="movie-page__meta">
              <span className="movie-page__rating">★ {movieDetails.tmdbRating}</span>
              <span className="movie-page__year">{movieDetails.releaseYear}</span>
              <span className="movie-page__genres">{movieDetails.genres?.[0]}</span>
              <span className="movie-page__runtime">{movieDetails.runtime} мин</span>
            </div>

            <h1 className="movie-page__title">{movieDetails.title}</h1>

            <p className="movie-page__plot">{movieDetails.plot}</p>

            <div className="movie-page__actions">
              <button
                type="button"
                className="movie-page__button movie-page__button--primary"
                onClick={() => setIsTrailerOpen(true)}
                disabled={!hasTrailer}
              >
                Трейлер
              </button>

              <button
                type="button"
                className={`movie-page__icon-btn ${
                  favoriteController.isFavorite
                    ? "movie-page__icon-btn--active"
                    : ""
                }`}
                disabled={favoriteController.disabled}
                onClick={favoriteController.toggleFavorite}
              >
                <svg className="movie-page__icon">
                  <use
                    href={`${spriteUrl}#${
                      favoriteController.isFavorite
                        ? "icon-favorites-filled"
                        : "icon-favorites"
                    }`}
                  />
                </svg>
              </button>
            </div>
          </div>

          <img
            className="movie-page__image"
            src={movieDetails.backdropUrl}
            alt={movieDetails.title}
          />
        </div>

        <div className="movie-page__about">
          <h2 className="movie-page__about-title">О фильме</h2>

          <div className="movie-page__about-rows">
            <div className="movie-page__about-row">
              <span>Год</span>
              <span>{movieDetails.releaseYear}</span>
            </div>

            <div className="movie-page__about-row">
              <span>Жанр</span>
              <span>{movieDetails.genres?.join(", ")}</span>
            </div>

            <div className="movie-page__about-row">
              <span>Длительность</span>
              <span>{movieDetails.runtime} мин</span>
            </div>
          </div>
        </div>
      </section>

      {isTrailerOpen && hasTrailer ? (
        <TrailerModal
          title={movieDetails.title}
          trailerUrl={movieDetails.trailerUrl}
          trailerYouTubeId={movieDetails.trailerYouTubeId}
          onClose={() => setIsTrailerOpen(false)}
        />
      ) : null}

      {favoriteController.isAuthOpen ? (
        <AuthModal onClose={favoriteController.closeAuth} />
      ) : null}
    </>
  );
}
