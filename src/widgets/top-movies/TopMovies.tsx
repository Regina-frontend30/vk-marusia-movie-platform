import type { Movie } from "../../shared/types/movie";
import { useNavigate } from "react-router-dom";
import "./TopMovies.scss";

type Props = {
  movies: Movie[];
};

function TopMovieCard({
  movie,
  position,
  onOpenMovie,
}: {
  movie: Movie;
  position: number;
  onOpenMovie: (movieId: number) => void;
}) {
  return (
    <div className="movie-card" onClick={() => onOpenMovie(movie.id)}>
      <span className="movie-card__position">{position}</span>
      <img className="movie-card__image" src={movie.posterUrl} alt={movie.title} />
    </div>
  );
}

export default function TopMovies({ movies }: Props) {
  const navigate = useNavigate();
  const openMovie = (movieId: number) => navigate(`/movie/${movieId}`);

  return (
    <section className="top-movies container">
      <h2 className="top-movies__title">Топ-10 фильмов</h2>

      <div className="top-movies__list">
        {movies.map((movie, index) => (
          <TopMovieCard key={movie.id} movie={movie} position={index + 1} onOpenMovie={openMovie} />
        ))}
      </div>
    </section>
  );
}
