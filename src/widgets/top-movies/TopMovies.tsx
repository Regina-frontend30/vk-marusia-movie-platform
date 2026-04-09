import "./TopMovies.scss";
import poster from "../../assets/images/home.png";

export default function TopMovies() {
  return (
    <section className="top-movies">
      <h2 className="home__title">Топ-10 фильмов</h2>

      <div className="home__list">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div className="movie-card" key={item}>
            <span className="movie-card__position">{item}</span>
            <img className="movie-card__image" src={poster} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}
