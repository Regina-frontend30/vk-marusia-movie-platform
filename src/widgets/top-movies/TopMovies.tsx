import "./TopMovies.scss";

import MovieCard from "../../entities/movie/MovieCard";
import { movies } from "../../entities/movie/model/movies";

function TopMovies() {
  return (
    <section className="top-movies">
      <h2 className="home__title">Топ-10 фильмов</h2>

      <div className="home__list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default TopMovies;
