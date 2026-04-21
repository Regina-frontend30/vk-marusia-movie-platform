import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie } from "../../shared/types/movie";
import "./MoviePage.scss";
import spriteUrl from "../../assets/sprite/sprite.svg";

const BASE_URL = "https://cinemaguide.skillbox.cc";

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const res = await fetch(`${BASE_URL}/movie/${id}`);
        const data = await res.json();
        setMovie(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  if (loading) {
    return <div className="container">Загрузка...</div>;
  }

  if (!movie) {
    return <div className="container">Фильм не найден</div>;
  }

  return (
    <section className="movie-page container">
      <div className="movie-page__hero">
        <div className="movie-page__info">
          <div className="movie-page__meta">
            <span className="movie-page__rating">★ {movie.tmdbRating}</span>
            <span className="movie-page__year">{movie.releaseYear}</span>
            <span className="movie-page__genres">{movie.genres?.[0]}</span>
            <span className="movie-page__runtime">{movie.runtime} мин</span>
          </div>

          <h1 className="movie-page__title">{movie.title}</h1>

          <p className="movie-page__plot">{movie.plot}</p>

          <div className="movie-page__actions">
            <button className="movie-page__button movie-page__button--primary">
              Трейлер
            </button>

            <button
              type="button"
              className={`movie-page__icon-btn ${
                isFavorite ? "movie-page__icon-btn--active" : ""
              }`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <svg className="movie-page__icon">
                <use
                  href={`${spriteUrl}#${
                    isFavorite ? "icon-favorites-filled" : "icon-favorites"
                  }`}
                />
              </svg>
            </button>
          </div>
        </div>

        <img
          className="movie-page__image"
          src={movie.backdropUrl}
          alt={movie.title}
        />
      </div>

      <div className="movie-page__about">
        <h2 className="movie-page__about-title">О фильме</h2>

        <div className="movie-page__about-rows">
          <div className="movie-page__about-row">
            <span>Год</span>
            <span>{movie.releaseYear}</span>
          </div>

          <div className="movie-page__about-row">
            <span>Жанр</span>
            <span>{movie.genres?.join(", ")}</span>
          </div>

          <div className="movie-page__about-row">
            <span>Длительность</span>
            <span>{movie.runtime} мин</span>
          </div>
        </div>
      </div>
    </section>
  );
}
