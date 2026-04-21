import { useParams } from "react-router-dom";
import { useState } from "react";
import { movies } from "../../entities/movie/model/movies";
import "./MoviePage.scss";
import spriteUrl from "../../assets/sprite/sprite.svg";

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();

  const movie = movies.find((m) => m.id === Number(id));

  const [isFavorite, setIsFavorite] = useState(false);

  if (!movie) {
    return <div className="container">Фильм не найден</div>;
  }

  return (
    <section className="movie-page container">
      <div className="movie-page__hero">
        <div className="movie-page__info">
          <div className="movie-page__meta">
            <span className="movie-page__rating">★ {movie.rating}</span>
            <span className="movie-page__year">{movie.year}</span>
            <span className="movie-page__genres">{movie.genre}</span>
            <span className="movie-page__runtime">{movie.runtime}</span>
          </div>

          <h1 className="movie-page__title">{movie.title}</h1>

          <p className="movie-page__plot">{movie.description}</p>

          <div className="movie-page__actions">
            {/* ТРЕЙЛЕР */}
            <button
              className="movie-page__button movie-page__button--primary"
              onClick={() => alert("Трейлер скоро будет")}
            >
              Трейлер
            </button>

            {/* ИЗБРАННОЕ */}
            <button
              type="button"
              className={`movie-page__icon-btn ${
                isFavorite ? "movie-page__icon-btn--active" : ""
              }`}
              aria-label="В избранное"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <svg className="movie-page__icon" aria-hidden="true">
                <use
                  href={`${spriteUrl}#${
                    isFavorite ? "icon-favorites-filled" : "icon-favorites"
                  }`}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* IMAGE */}
        <img
          className="movie-page__image"
          src={movie.image}
          alt={movie.title}
        />
      </div>

      {/* ABOUT */}
      <div className="movie-page__about">
        <h2 className="movie-page__about-title">О фильме</h2>

        <div className="movie-page__about-rows">
          <div className="movie-page__about-row">
            <span>Язык оригинала</span>
            <span>Русский</span>
          </div>

          <div className="movie-page__about-row">
            <span>Бюджет</span>
            <span>250 000 руб.</span>
          </div>

          <div className="movie-page__about-row">
            <span>Выручка</span>
            <span>2 835 000 руб.</span>
          </div>

          <div className="movie-page__about-row">
            <span>Режиссёр</span>
            <span>Игорь Масленников</span>
          </div>

          <div className="movie-page__about-row">
            <span>Продакшен</span>
            <span>Ленфильм</span>
          </div>

          <div className="movie-page__about-row">
            <span>Награды</span>
            <span>Топ-250, 33 место</span>
          </div>
        </div>
      </div>
    </section>
  );
}
