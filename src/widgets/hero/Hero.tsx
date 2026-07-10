import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../shared/types/movie";
import spriteUrl from "../../assets/sprite/sprite.svg";
import AuthModal from "../../features/auth/AuthModal";
import TrailerModal from "../../shared/ui/trailer-modal/TrailerModal";
import { useFavoriteToggle } from "../../hooks/useFavoriteToggle";
import "./Hero.scss";

type Props = {
  movie: Movie;
  onRefresh: () => void;
};

type HeroController = ReturnType<typeof useHeroController>;

type HeroContentProps = Props & {
  hasTrailer: boolean;
  heroController: HeroController;
};

type HeroActionsProps = {
  hasTrailer: boolean;
  favoriteController: ReturnType<typeof useFavoriteToggle>;
  onOpenTrailer: () => void;
  onOpenMovie: () => void;
  onRefresh: () => void;
};

function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours ? hours + " ч " : ""}${remainingMinutes} мин`;
}

function getFavoriteIconId(isFavorite: boolean) {
  return isFavorite ? "icon-favorites-filled" : "icon-favorites";
}

function getFavoriteLabel(isFavorite: boolean) {
  return isFavorite ? "Убрать из избранного" : "В избранное";
}

function HeroMeta({ movie }: Pick<Props, "movie">) {
  return (
    <div className="hero__meta">
      <span className="hero__rating">★ {movie.tmdbRating?.toFixed(1) || "—"}</span>
      <span className="hero__year">{movie.releaseYear}</span>
      <span className="hero__genres">{movie.genres?.[0] || "—"}</span>
      <span className="hero__runtime">{formatRuntime(movie.runtime)}</span>
    </div>
  );
}

function HeroFavoriteButton({
  isFavorite,
  disabled,
  onClick,
}: {
  isFavorite: boolean;
  disabled: boolean;
  onClick: () => Promise<void>;
}) {
  return (
    <button type="button" className={`hero__icon-btn ${isFavorite ? "hero__icon-btn--active" : ""}`} aria-label={getFavoriteLabel(isFavorite)} disabled={disabled} onClick={onClick}>
      <svg aria-hidden="true">
        <use href={`${spriteUrl}#${getFavoriteIconId(isFavorite)}`} />
      </svg>
    </button>
  );
}

function HeroRefreshButton({ onRefresh }: Pick<HeroActionsProps, "onRefresh">) {
  return (
    <button type="button" className="hero__icon-btn" aria-label="Обновить" onClick={onRefresh}>
      <svg aria-hidden="true"><use href={`${spriteUrl}#icon-update`} /></svg>
    </button>
  );
}

function HeroActions({
  hasTrailer,
  favoriteController,
  onOpenTrailer,
  onOpenMovie,
  onRefresh,
}: HeroActionsProps) {
  return (
    <div className="hero__actions">
      <button type="button" className="hero__button hero__button--primary" onClick={onOpenTrailer} disabled={!hasTrailer}>Трейлер</button>
      <button type="button" className="hero__button hero__button--secondary" onClick={onOpenMovie}>О фильме</button>
      <div className="hero__icons">
        <HeroFavoriteButton isFavorite={favoriteController.isFavorite} disabled={favoriteController.disabled} onClick={favoriteController.toggleFavorite} />
        <HeroRefreshButton onRefresh={onRefresh} />
      </div>
    </div>
  );
}

function HeroTrailerModal({
  isOpen,
  hasTrailer,
  movie,
  onClose,
}: {
  isOpen: boolean;
  hasTrailer: boolean;
  movie: Movie;
  onClose: () => void;
}) {
  if (!isOpen || !hasTrailer) {
    return null;
  }

  return <TrailerModal title={movie.title} trailerUrl={movie.trailerUrl} trailerYouTubeId={movie.trailerYouTubeId} onClose={onClose} />;
}

function useHeroController(movieId: number) {
  const navigate = useNavigate();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const favoriteController = useFavoriteToggle(movieId);

  return {
    favoriteController,
    isTrailerOpen,
    openTrailer: () => setIsTrailerOpen(true),
    closeTrailer: () => setIsTrailerOpen(false),
    openMovie: () => navigate(`/movie/${movieId}`),
  };
}

function HeroInfo({
  movie,
  onRefresh,
  hasTrailer,
  heroController,
}: HeroContentProps) {
  return (
    <div className="hero__info">
      <HeroMeta movie={movie} />
      <h1 className="hero__title">{movie.title}</h1>
      <p className="hero__description">{movie.plot}</p>
      <HeroActions hasTrailer={hasTrailer} favoriteController={heroController.favoriteController} onOpenTrailer={heroController.openTrailer} onOpenMovie={heroController.openMovie} onRefresh={onRefresh} />
    </div>
  );
}

function HeroImage({ movie }: Pick<HeroContentProps, "movie">) {
  return <img className="hero__image" src={movie.backdropUrl} alt={movie.title} />;
}

function HeroContentLayout(contentProps: HeroContentProps) {
  return (
    <div className="hero__content container">
      <HeroInfo {...contentProps} />
      <HeroImage movie={contentProps.movie} />
    </div>
  );
}

function HeroOverlays({
  movie,
  hasTrailer,
  heroController,
}: Pick<HeroContentProps, "movie" | "hasTrailer" | "heroController">) {
  return (
    <>
      <HeroTrailerModal isOpen={heroController.isTrailerOpen} hasTrailer={hasTrailer} movie={movie} onClose={heroController.closeTrailer} />
      {heroController.favoriteController.isAuthOpen ? <AuthModal onClose={heroController.favoriteController.closeAuth} /> : null}
    </>
  );
}

function HeroContent(contentProps: HeroContentProps) {
  return (
    <section className="hero">
      <HeroContentLayout {...contentProps} />
      <HeroOverlays movie={contentProps.movie} hasTrailer={contentProps.hasTrailer} heroController={contentProps.heroController} />
    </section>
  );
}

export default function Hero({ movie, onRefresh }: Props) {
  const heroController = useHeroController(movie.id);
  const hasTrailer = Boolean(movie.trailerYouTubeId || movie.trailerUrl);
  return <HeroContent movie={movie} onRefresh={onRefresh} hasTrailer={hasTrailer} heroController={heroController} />;
}
