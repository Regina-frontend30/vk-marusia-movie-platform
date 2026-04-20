import { Link } from "react-router-dom";
import "./MovieCard.scss";

type Props = {
  id: number;
  title: string;
  poster: string;
  position: number;
};

export default function MovieCard({ id, title, poster, position }: Props) {
  return (
    <Link to={`/movie/${id}`} className="movie-card">
      <span className="movie-card__position">{position}</span>

      <img className="movie-card__image" src={poster} alt={title} />
    </Link>
  );
}
