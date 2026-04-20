import MovieCard from "../../entities/movie/MovieCard";
import { movies } from "../../entities/movie/model/movies";
import "./TopMovies.scss";

export default function TopMovies() {
  return (
    <section className="top-movies">
      <h2 className="home__title">Топ-10 фильмов</h2>

      <div className="home__list">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster={movie.image}
            position={movie.id}
          />
        ))}
      </div>
    </section>
  );
}
