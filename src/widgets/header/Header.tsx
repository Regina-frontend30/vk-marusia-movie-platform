import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import "./Header.scss";

import logo from "../../assets/logo/logo.svg";
import spriteUrl from "../../assets/sprite/sprite.svg";
import AuthModal from "../../features/auth/AuthModal";
import { useMovieSearchDropdown } from "../../hooks/useMovieSearchDropdown";
import { useAuth } from "../../app/providers/useAuth";

type HeaderUser = ReturnType<typeof useAuth>["user"];

type SearchController = ReturnType<
  typeof useMovieSearchDropdown
>;

type SearchMovie = SearchController["visibleResults"][number];

type HeaderLayoutProps = {
  currentUser: HeaderUser;
  accountDisplayName: string;
  isMobileSearchOpen: boolean;
  closeMobileSearch: () => void;
  openMobileSearch: () => void;
  openAuthModal: () => void;
  searchController: SearchController;
};

type SearchClearButtonProps = {
  searchQuery: string;
  isMobileSearchOpen: boolean;
  clearSearch: () => void;
  closeMobileSearch: () => void;
};

type SearchDropdownProps = {
  searchLoading: boolean;
  visibleResults: SearchController["visibleResults"];
  onSelect: () => void;
};

type HeaderSearchProps = SearchController & {
  isMobileSearchOpen: boolean;
  closeMobileSearch: () => void;
};

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

function getHeaderLinkClassName({
  isActive,
}: {
  isActive: boolean;
}) {
  return isActive
    ? "header__link header__link--active"
    : "header__link";
}

function getAccountDisplayName(currentUser: HeaderUser) {
  return (
    [currentUser?.name, currentUser?.surname]
      .filter(Boolean)
      .join(" ") ||
    currentUser?.email ||
    "Аккаунт"
  );
}

function HeaderNavLink({
  to,
  children,
  end,
}: {
  to: string;
  children: React.ReactNode;
  end?: boolean;
}) {
  return (
    <NavLink to={to} end={end} className={getHeaderLinkClassName}>
      {children}
    </NavLink>
  );
}

function SearchClearButton({
  searchQuery,
  isMobileSearchOpen,
  clearSearch,
  closeMobileSearch,
}: SearchClearButtonProps) {
  if (!searchQuery && !isMobileSearchOpen) {
    return null;
  }

  return (
    <button type="button" className="header__search-clear" onClick={searchQuery ? clearSearch : closeMobileSearch} aria-label="Очистить поиск">
      ×
    </button>
  );
}

function SearchResultList({
  visibleResults,
  onSelect,
}: Pick<SearchDropdownProps, "visibleResults" | "onSelect">) {
  return (
    <>
      {visibleResults.map((movie) => (
        <SearchResultItem
          key={movie.id}
          movie={movie}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function SearchResultMeta({ movie }: { movie: SearchMovie }) {
  return (
    <div className="header__search-item-meta">
      <span className="header__search-item-rating header__search-item-rating--high">{movie.tmdbRating.toFixed(1)}</span>
      <span className="header__search-item-meta-text">{movie.releaseYear}</span>
      {movie.genres[0] ? <span className="header__search-item-meta-text">{movie.genres[0]}</span> : null}
      {movie.runtime ? <span className="header__search-item-meta-text">{formatRuntime(movie.runtime)}</span> : null}
    </div>
  );
}

function SearchResultItem({
  movie,
  onSelect,
}: {
  movie: SearchMovie;
  onSelect: () => void;
}) {
  return (
    <Link to={`/movie/${movie.id}`} className="header__search-item" onClick={onSelect}>
      <img src={movie.posterUrl} alt={movie.title} className="header__search-item-image" />
      <div className="header__search-item-content">
        <SearchResultMeta movie={movie} />
        <span className="header__search-item-title">{movie.title}</span>
      </div>
    </Link>
  );
}

function SearchDropdown({
  searchLoading,
  visibleResults,
  onSelect,
}: SearchDropdownProps) {
  if (searchLoading) {
    return <div className="header__search-empty">Загрузка...</div>;
  }

  return visibleResults.length > 0 ? (
    <SearchResultList
      visibleResults={visibleResults}
      onSelect={onSelect}
    />
  ) : (
    <div className="header__search-empty">Ничего не найдено</div>
  );
}

function SearchInput({
  searchQuery,
  onChangeSearch,
  onFocusSearch,
}: Pick<
  SearchController,
  "searchQuery" | "onChangeSearch" | "onFocusSearch"
>) {
  return (
    <input
      className="header__search"
      placeholder="Поиск"
      value={searchQuery}
      onChange={(event) => onChangeSearch(event.target.value)}
      onFocus={onFocusSearch}
    />
  );
}

function SearchDropdownPanel(props: SearchDropdownProps) {
  return (
    <div className="header__search-dropdown">
      <SearchDropdown {...props} />
    </div>
  );
}

function HeaderSearch({
  searchQuery,
  searchLoading,
  searchWrapRef,
  visibleResults,
  searchOpen,
  onChangeSearch,
  onFocusSearch,
  clearSearch,
  closeDropdown,
  isMobileSearchOpen,
  closeMobileSearch,
}: HeaderSearchProps) {
  const handleSelectMovie = () => {
    closeDropdown();
    closeMobileSearch();
  };

  return (
    <div className={`header__search-wrap ${isMobileSearchOpen ? "header__search-wrap--mobile-open" : ""}`} ref={searchWrapRef}>
      <span className="header__search-icon" aria-hidden="true"><svg><use href={`${spriteUrl}#icon-search`} /></svg></span>
      <SearchInput searchQuery={searchQuery} onChangeSearch={onChangeSearch} onFocusSearch={onFocusSearch} />
      <SearchClearButton searchQuery={searchQuery} isMobileSearchOpen={isMobileSearchOpen} clearSearch={clearSearch} closeMobileSearch={closeMobileSearch} />
      {searchOpen ? <SearchDropdownPanel searchLoading={searchLoading} visibleResults={visibleResults} onSelect={handleSelectMovie} /> : null}
    </div>
  );
}

function HeaderUserActions({
  accountDisplayName,
  closeMobileSearch,
}: {
  accountDisplayName: string;
  closeMobileSearch: () => void;
}) {
  return (
    <>
      <HeaderNavLink to="/account">{accountDisplayName}</HeaderNavLink>
      <NavLink to="/account" className="header__mobile-action" aria-label="В профиль" onClick={closeMobileSearch}>
        <svg aria-hidden="true"><use href={`${spriteUrl}#icon-name`} /></svg>
      </NavLink>
    </>
  );
}

function HeaderGuestActions({
  openAuthModal,
}: {
  openAuthModal: () => void;
}) {
  return (
    <>
      <button type="button" className="header__link" onClick={openAuthModal}>Войти</button>
      <button type="button" className="header__mobile-action" aria-label="Войти" onClick={openAuthModal}>
        <svg aria-hidden="true"><use href={`${spriteUrl}#icon-name`} /></svg>
      </button>
    </>
  );
}

function HeaderMobileActions({
  closeMobileSearch,
  openMobileSearch,
}: {
  closeMobileSearch: () => void;
  openMobileSearch: () => void;
}) {
  return (
    <div className="header__mobile-actions">
      <NavLink to="/genres" className="header__mobile-action" aria-label="К жанрам" onClick={closeMobileSearch}><svg aria-hidden="true"><use href={`${spriteUrl}#icon-genre`} /></svg></NavLink>
      <button type="button" className="header__mobile-action" aria-label="К поиску" onClick={openMobileSearch}><svg aria-hidden="true"><use href={`${spriteUrl}#icon-search`} /></svg></button>
    </div>
  );
}

function useHeaderModalState() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return {
    isAuthModalOpen,
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),
  };
}

function useHeaderMobileSearch(
  closeDropdown: SearchController["closeDropdown"]
) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] =
    useState(false);

  function closeMobileSearch() {
    setIsMobileSearchOpen(false);
    closeDropdown();
  }

  return {
    isMobileSearchOpen,
    openMobileSearch: () => setIsMobileSearchOpen(true),
    closeMobileSearch,
  };
}

function HeaderLayout({
  currentUser,
  accountDisplayName,
  isMobileSearchOpen,
  closeMobileSearch,
  openMobileSearch,
  openAuthModal,
  searchController,
}: HeaderLayoutProps) {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/"><img src={logo} alt="VK Marusia" className="header__logo" /></Link>
        <div className="header__center"><nav className="header__nav"><HeaderNavLink to="/" end>Главная</HeaderNavLink><HeaderNavLink to="/genres">Жанры</HeaderNavLink></nav><HeaderSearch {...searchController} isMobileSearchOpen={isMobileSearchOpen} closeMobileSearch={closeMobileSearch} /></div>
        <div className="header__right">{currentUser ? <HeaderUserActions accountDisplayName={accountDisplayName} closeMobileSearch={closeMobileSearch} /> : <HeaderGuestActions openAuthModal={openAuthModal} />}<HeaderMobileActions closeMobileSearch={closeMobileSearch} openMobileSearch={openMobileSearch} /></div>
      </div>
    </header>
  );
}

export default function Header() {
  const { user: currentUser } = useAuth();
  const searchController = useMovieSearchDropdown();
  const headerModalState = useHeaderModalState();
  const headerMobileSearch = useHeaderMobileSearch(
    searchController.closeDropdown
  );
  const accountDisplayName = getAccountDisplayName(currentUser);

  return (
    <>
      <HeaderLayout currentUser={currentUser} accountDisplayName={accountDisplayName} searchController={searchController} {...headerMobileSearch} openAuthModal={headerModalState.openAuthModal} />
      {headerModalState.isAuthModalOpen ? <AuthModal onClose={headerModalState.closeAuthModal} /> : null}
    </>
  );
}
