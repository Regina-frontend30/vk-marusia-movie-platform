import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import "./Header.scss";

import logo from "../../assets/logo/logo.svg";
import spriteUrl from "../../assets/sprite/sprite.svg";
import AuthModal from "../../features/auth/AuthModal";
import { useMovieSearchDropdown } from "../../hooks/useMovieSearchDropdown";
import { useAuth } from "../../app/providers/useAuth";

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
  const [isMobileSearchOpen, setIsMobileSearchOpen] =
    useState(false);
  const { user } = useAuth();

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

  const accountLabel =
    [user?.name, user?.surname].filter(Boolean).join(" ") ||
    user?.email ||
    "Аккаунт";

  function openAuthModal() {
    setIsAuthModalOpen(true);
  }

  function openMobileSearch() {
    setIsMobileSearchOpen(true);
  }

  function closeMobileSearch() {
    setIsMobileSearchOpen(false);
    closeDropdown();
  }

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link to="/">
            <img src={logo} alt="VK Marusia" className="header__logo" />
          </Link>

          <div className="header__center">
            <nav className="header__nav">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive
                    ? "header__link header__link--active"
                    : "header__link"
                }
              >
                Главная
              </NavLink>

              <NavLink
                to="/genres"
                className={({ isActive }) =>
                  isActive
                    ? "header__link header__link--active"
                    : "header__link"
                }
              >
                Жанры
              </NavLink>
            </nav>

            <div
              className={`header__search-wrap ${
                isMobileSearchOpen
                  ? "header__search-wrap--mobile-open"
                  : ""
              }`}
              ref={searchWrapRef}
            >
              <span className="header__search-icon" aria-hidden="true">
                <svg>
                  <use href={`${spriteUrl}#icon-search`} />
                </svg>
              </span>

              <input
                className="header__search"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => onChangeSearch(e.target.value)}
                onFocus={onFocusSearch}
              />

              {(searchQuery || isMobileSearchOpen) && (
                <button
                  type="button"
                  className="header__search-clear"
                  onClick={
                    searchQuery ? clearSearch : closeMobileSearch
                  }
                  aria-label="Очистить поиск"
                >
                  ×
                </button>
              )}

              {searchOpen && (
                <div className="header__search-dropdown">
                  {searchLoading ? (
                    <div className="header__search-empty">
                      Загрузка...
                    </div>
                  ) : visibleResults.length > 0 ? (
                    visibleResults.map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="header__search-item"
                        onClick={() => {
                          closeDropdown();
                          closeMobileSearch();
                        }}
                      >
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="header__search-item-image"
                        />

                        <div className="header__search-item-content">
                          <div className="header__search-item-meta">
                            <span className="header__search-item-rating header__search-item-rating--high">
                              {movie.tmdbRating.toFixed(1)}
                            </span>
                            <span className="header__search-item-meta-text">
                              {movie.releaseYear}
                            </span>
                            {movie.genres[0] ? (
                              <span className="header__search-item-meta-text">
                                {movie.genres[0]}
                              </span>
                            ) : null}
                            {movie.runtime ? (
                              <span className="header__search-item-meta-text">
                                {formatRuntime(movie.runtime)}
                              </span>
                            ) : null}
                          </div>

                          <span className="header__search-item-title">
                            {movie.title}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="header__search-empty">
                      Ничего не найдено
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="header__right">
            {user ? (
              <>
                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    isActive
                      ? "header__link header__link--active"
                      : "header__link"
                  }
                >
                  {accountLabel}
                </NavLink>

                <NavLink
                  to="/account"
                  className="header__mobile-action"
                  aria-label="В профиль"
                  onClick={closeMobileSearch}
                >
                  <svg aria-hidden="true">
                    <use href={`${spriteUrl}#icon-name`} />
                  </svg>
                </NavLink>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="header__link"
                  onClick={openAuthModal}
                >
                  Войти
                </button>

                <button
                  type="button"
                  className="header__mobile-action"
                  aria-label="Войти"
                  onClick={openAuthModal}
                >
                  <svg aria-hidden="true">
                    <use href={`${spriteUrl}#icon-name`} />
                  </svg>
                </button>
              </>
            )}

            <div className="header__mobile-actions">
              <NavLink
                to="/genres"
                className="header__mobile-action"
                aria-label="К жанрам"
                onClick={closeMobileSearch}
              >
                <svg aria-hidden="true">
                  <use href={`${spriteUrl}#icon-genre`} />
                </svg>
              </NavLink>

              <button
                type="button"
                className="header__mobile-action"
                aria-label="К поиску"
                onClick={openMobileSearch}
              >
                <svg aria-hidden="true">
                  <use href={`${spriteUrl}#icon-search`} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
}
