import "./MovieCard.scss";

type Props = {
  image: string;
  position: number;
};

export default function MovieCard({ image, position }: Props) {
  return (
    <div className="movie-card">
      <span className="movie-card__position">{position}</span>

      <img className="movie-card__image" src={image} alt="movie" />
    </div>
  );
}
