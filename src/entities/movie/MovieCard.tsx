import "./MovieCard.scss";

type Props = {
  title: string;
  poster: string;
  position: number;
};

export default function MovieCard({ title, poster, position }: Props) {
  return (
    <div className="movie-card">
      <span className="movie-card__position">{position}</span>

      <img className="movie-card__image" src={poster} alt={title} />
    </div>
  );
}
