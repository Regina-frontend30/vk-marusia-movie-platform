import MovieCard from "../../entities/movie/MovieCard";
import poster from "../../assets/images/home.png";
import "./TopMovies.scss";

export default function TopMovies() {
  return (
    <section className="top-movies">
      <h2 className="home__title">Топ-10 фильмов</h2>

      <div className="home__list">
        {Array.from({ length: 10 }).map((_, index) => (
          <MovieCard
            key={index}
            title="Фильм"
            poster={poster}
            position={index + 1}
          />
        ))}
      </div>
    </section>
  );
}
