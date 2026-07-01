import { Link, useParams } from "react-router-dom";

import "./GenresPage.scss";

import { useGenresPage } from "../../hooks/useGenresPage";

function GenresPageLoader() {
  return <div className="container">Loading...</div>;
}

function GenreMovieCard({
  movieId,
  posterUrl,
  title,
}: {
  movieId: number;
  posterUrl: string;
  title: string;
}) {
  return (
    <Link to={`/movie/${movieId}`} className="genres-page__movie-card">
      <img className="genres-page__movie-image" src={posterUrl} alt={title} loading="lazy" />
    </Link>
  );
}

function GenreMoviesGrid({
  visibleMovies,
}: {
  visibleMovies: ReturnType<typeof useGenresPage>["visibleMovies"];
}) {
  return (
    <div className="genres-page__movies-grid">
      {visibleMovies.map((movie) => (
        <GenreMovieCard key={movie.id} movieId={movie.id} posterUrl={movie.posterUrl} title={movie.title} />
      ))}
    </div>
  );
}

function GenresShowMoreButton({
  canShowMore,
  showMore,
}: Pick<ReturnType<typeof useGenresPage>, "canShowMore" | "showMore">) {
  if (!canShowMore) {
    return null;
  }

  return (
    <div className="genres-page__more-wrap">
      <button type="button" className="genres-page__more" onClick={showMore}>
        Показать ещё
      </button>
    </div>
  );
}

function GenreMoviesContent({
  moviesLoading,
  visibleMovies,
  canShowMore,
  showMore,
}: Pick<
  ReturnType<typeof useGenresPage>,
  "moviesLoading" | "visibleMovies" | "canShowMore" | "showMore"
>) {
  if (moviesLoading) {
    return <div className="genres-page__loading">Loading...</div>;
  }

  return (
    <>
      <GenreMoviesGrid visibleMovies={visibleMovies} />
      <GenresShowMoreButton canShowMore={canShowMore} showMore={showMore} />
    </>
  );
}

function GenreMoviesPage({
  genreName,
  moviesLoading,
  visibleMovies,
  canShowMore,
  showMore,
}: Pick<
  ReturnType<typeof useGenresPage>,
  "genreName" | "moviesLoading" | "visibleMovies" | "canShowMore" | "showMore"
>) {
  return (
    <div className="container genres-page">
      <h1 className="genres-page__title">{genreName}</h1>
      <GenreMoviesContent moviesLoading={moviesLoading} visibleMovies={visibleMovies} canShowMore={canShowMore} showMore={showMore} />
    </div>
  );
}

function GenresCardImage({
  imageUrl,
  name,
}: {
  imageUrl: string | null;
  name: string;
}) {
  return imageUrl ? (
    <img className="genres-page__image" src={imageUrl} alt={name} loading="lazy" />
  ) : (
    <div className="genres-page__image genres-page__image--placeholder" />
  );
}

function GenreCard({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl: string | null;
}) {
  return (
    <Link to={`/genres/${encodeURIComponent(name)}`} className="genres-page__card">
      <GenresCardImage imageUrl={imageUrl} name={name} />
      <div className="genres-page__label">{name}</div>
    </Link>
  );
}

function GenresCardsGrid({
  genres,
}: Pick<ReturnType<typeof useGenresPage>, "genres">) {
  return (
    <div className="genres-page__grid">
      {genres.map((genre) => (
        <GenreCard key={genre.name} name={genre.name} imageUrl={genre.imageUrl} />
      ))}
    </div>
  );
}

function GenresListPage({
  genres,
}: Pick<ReturnType<typeof useGenresPage>, "genres">) {
  return (
    <div className="container genres-page">
      <h1 className="genres-page__title">Жанры фильмов</h1>
      <GenresCardsGrid genres={genres} />
    </div>
  );
}

export default function GenresPage() {
  const { genre } = useParams();
  const pageData = useGenresPage(genre);
  if (pageData.loading) {
    return <GenresPageLoader />;
  }

  if (pageData.genreName) {
    return <GenreMoviesPage genreName={pageData.genreName} moviesLoading={pageData.moviesLoading} visibleMovies={pageData.visibleMovies} canShowMore={pageData.canShowMore} showMore={pageData.showMore} />;
  }

  return <GenresListPage genres={pageData.genres} />;
}
