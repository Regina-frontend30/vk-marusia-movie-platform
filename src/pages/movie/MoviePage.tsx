import { useParams } from "react-router-dom";
import { movies } from "../../entities/movie/model/movies";

function MoviePage() {
  const { id } = useParams();

  const movie = movies.find((m) => m.id === Number(id));

  if (!movie) {
    return <div>Фильм не найден</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>{movie.title}</h1>
      <img src={movie.image} alt={movie.title} style={{ width: 300 }} />
    </div>
  );
}

export default MoviePage;
