import { Routes, Route } from "react-router-dom";
import MainLayout from "./app/layouts/MainLayout";

import HomePage from "./pages/home/HomePage";
import MoviePage from "./pages/movie/MoviePage";
import GenresPage from "./pages/genres/GenresPage";
import AccountPage from "./pages/account/AccountPage";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/movie/:id" element={<MoviePage />} />

        <Route path="/genres" element={<GenresPage />} />

        <Route path="/genres/:genre" element={<GenresPage />} />

        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
