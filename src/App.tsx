import { Routes, Route } from "react-router-dom";
import MainLayout from "./app/layouts/MainLayout";
import HomePage from "./pages/home/HomePage";
import MoviePage from "./pages/movie/MoviePage";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
