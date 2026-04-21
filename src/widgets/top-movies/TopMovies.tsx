import type { Movie } from "../../shared/types/movie";
import { useNavigate } from "react-router-dom";
import "./TopMovies.scss";

type Props = {
  movies: Movie[];
};

export default function TopMovies({ movies }: Props) {
  const navigate = useNavigate();

  return (
    <section className="top-movies container">
      <h2 className="home__title">Топ-10 фильмов</h2>

      <div className="home__list">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <span className="movie-card__position">{index + 1}</span>

            <img
              className="movie-card__image"
              src={movie.posterUrl}
              alt={movie.title}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
