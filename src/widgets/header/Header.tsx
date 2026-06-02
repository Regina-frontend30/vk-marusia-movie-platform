import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import "./Header.scss";

import logo from "../../assets/logo/logo.svg";
import AuthModal from "../../features/auth/AuthModal";
import { useMovieSearchDropdown } from "../../hooks/useMovieSearchDropdown";

function formatRuntime(runtime: number) {
  if (!runtime) {
    return "";
  }

  if (runtime < 60) {
    return `${runtime} мин`;
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return minutes > 0 ? `${hours} ч ${minutes} мин` : `${hours} ч`;
}

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const {
    searchQuery,
    searchLoading,
    searchWrapRef,
    visibleResults,
    searchOpen,
    onChangeSearch,
    onFocusSearch,
    clearSearch,
    closeDropdown,
  } = useMovieSearchDropdown();

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link to="/">
            <img src={logo} alt="VK Marusia" className="header__logo" />
          </Link>

          <nav className="header__nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "header__link header__link--active" : "header__link"
              }
            >
              Главная
            </NavLink>

            <NavLink
              to="/genres"
              className={({ isActive }) =>
                isActive ? "header__link header__link--active" : "header__link"
              }
            >
              Жанры
            </NavLink>
          </nav>

          <div className="header__right">
            <div className="header__search-wrap" ref={searchWrapRef}>
              <span className="header__search-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5833 14.5833L18.3333 18.3333"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="8.75"
                    cy="8.75"
                    r="5.91667"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>

              <input
                className="header__search"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => onChangeSearch(e.target.value)}
                onFocus={onFocusSearch}
              />

              {searchQuery && (
                <button
                  type="button"
                  className="header__search-clear"
                  onClick={clearSearch}
                  aria-label="Очистить поиск"
                >
                  ×
                </button>
              )}

              {searchOpen && (
                <div className="header__dropdown">
                  {searchLoading ? (
                    <div className="header__dropdown-state">Загрузка...</div>
                  ) : visibleResults.length > 0 ? (
                    visibleResults.map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="header__dropdown-item"
                        onClick={closeDropdown}
                      >
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="header__dropdown-image"
                        />

                        <div className="header__dropdown-content">
                          <div className="header__dropdown-meta">
                            <span className="header__dropdown-rating">
                              {movie.tmdbRating.toFixed(1)}
                            </span>
                            <span>{movie.releaseYear}</span>
                            {movie.genres[0] ? (
                              <span className="header__dropdown-genre">
                                {movie.genres[0]}
                              </span>
                            ) : null}
                            {movie.runtime ? (
                              <span>{formatRuntime(movie.runtime)}</span>
                            ) : null}
                          </div>

                          <span className="header__dropdown-title">
                            {movie.title}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="header__dropdown-state">
                      Ничего не найдено
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="header__link"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Войти
            </button>
          </div>
        </div>
      </header>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
}
