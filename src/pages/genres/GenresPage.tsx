import { Link, useParams } from "react-router-dom";

import "./GenresPage.scss";

import { useGenresPage } from "../../hooks/useGenresPage";

export default function GenresPage() {
  const { genre } = useParams();

  const {
    loading,
    genreName,
    genres,
    moviesLoading,
    visibleMovies,
    canShowMore,
    showMore,
  } = useGenresPage(genre);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (genreName) {
    return (
      <div className="container genres-page">
        <h1 className="genres-page__title">{genreName}</h1>

        {moviesLoading ? (
          <div className="genres-page__loading">Loading...</div>
        ) : (
          <>
            <div className="genres-page__movies-grid">
              {visibleMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  className="genres-page__movie-card"
                >
                  <img
                    className="genres-page__movie-image"
                    src={movie.posterUrl}
                    alt={movie.title}
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>

            {canShowMore ? (
              <div className="genres-page__more-wrap">
                <button
                  type="button"
                  className="genres-page__more"
                  onClick={showMore}
                >
                  Показать ещё
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="container genres-page">
      <h1 className="genres-page__title">Жанры фильмов</h1>

      <div className="genres-page__grid">
        {genres.map((genre) => (
          <Link
            key={genre.name}
            to={`/genres/${encodeURIComponent(genre.name)}`}
            className="genres-page__card"
          >
            {genre.imageUrl ? (
              <img
                className="genres-page__image"
                src={genre.imageUrl}
                alt={genre.name}
                loading="lazy"
              />
            ) : (
              <div className="genres-page__image genres-page__image--placeholder" />
            )}

            <div className="genres-page__label">{genre.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
