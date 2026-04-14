import "./MovieCard.scss";
import type { Movie } from "./model/movies";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  return (
    <div className="movie-card">
      <span className="movie-card__position">{movie.id}</span>

      <img
        className="movie-card__image"
        src={movie.image}
        alt={movie.title}
      />
    </div>
  );
}