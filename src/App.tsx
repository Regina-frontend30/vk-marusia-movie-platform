import MainLayout from "./app/layouts/MainLayout";
import Hero from "./widgets/hero/Hero";
import TopMovies from "./widgets/top-movies/TopMovies";

function App() {
  return (
    <MainLayout>
      <Hero />
      <TopMovies />
    </MainLayout>
  );
}

export default App;
