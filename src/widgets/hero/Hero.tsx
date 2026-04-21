import { useNavigate } from "react-router-dom";
import type { Movie } from "../../shared/types/movie";
import spriteUrl from "../../assets/sprite/sprite.svg";
import "./Hero.scss";

type Props = {
  movie: Movie;
  onRefresh: () => void;
};

export default function Hero({ movie, onRefresh }: Props) {
  const navigate = useNavigate();

  function formatRuntime(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h ? h + " ч " : ""}${m} мин`;
  }

  return (
    <section className="hero">
      <div className="hero__content container">
        {/* LEFT */}
        <div className="hero__info">
          <div className="hero__meta">
            <span className="hero__rating">
              ★ {movie.tmdbRating?.toFixed(1) || "—"}
            </span>

            <span className="hero__year">{movie.releaseYear}</span>

            <span className="hero__genres">{movie.genres?.[0] || "—"}</span>

            <span className="hero__runtime">
              {formatRuntime(movie.runtime)}
            </span>
          </div>

          <h1 className="hero__title">{movie.title}</h1>

          <p className="hero__description">{movie.plot}</p>

          {}
          <div className="hero__actions">
            {}
            <button className="hero__button hero__button--primary">
              Трейлер
            </button>

            {}
            <button
              className="hero__button hero__button--secondary"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              О фильме
            </button>

            {}
            <div className="hero__icons">
              {}
              <button
                type="button"
                className="hero__icon-btn"
                aria-label="В избранное"
              >
                <svg aria-hidden="true">
                  <use href={`${spriteUrl}#icon-favorites`} />
                </svg>
              </button>

              {}
              <button
                type="button"
                className="hero__icon-btn"
                aria-label="Обновить"
                onClick={onRefresh}
              >
                <svg aria-hidden="true">
                  <use href={`${spriteUrl}#icon-update`} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {}
        <img
          className="hero__image"
          src={movie.backdropUrl}
          alt={movie.title}
        />
      </div>
    </section>
  );
}
