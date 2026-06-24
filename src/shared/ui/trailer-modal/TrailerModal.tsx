import { useEffect } from "react";

import "./TrailerModal.scss";

type Props = {
  title: string;
  trailerUrl?: string;
  trailerYouTubeId?: string;
  onClose: () => void;
};

function getYouTubeEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

function getYoutubeVideoId(trailerUrl: string) {
  const youtubeMatch = trailerUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
  );

  return youtubeMatch?.[1] ?? null;
}

function getEmbedUrl(
  trailerUrl?: string,
  trailerYouTubeId?: string
) {
  if (trailerYouTubeId) {
    return getYouTubeEmbedUrl(trailerYouTubeId);
  }

  if (!trailerUrl) {
    return null;
  }

  const youtubeVideoId = getYoutubeVideoId(trailerUrl);
  if (youtubeVideoId) {
    return getYouTubeEmbedUrl(youtubeVideoId);
  }

  return trailerUrl;
}

function useCloseOnEscape(onClose: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [onClose]);
}

function TrailerFrame({
  title,
  embedUrl,
}: {
  title: string;
  embedUrl: string;
}) {
  return (
    <div className="trailer-modal__frame-wrap">
      <iframe
        className="trailer-modal__frame"
        src={embedUrl}
        title={`Трейлер ${title}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

function TrailerModalContent({
  title,
  embedUrl,
  onClose,
}: {
  title: string;
  embedUrl: string;
  onClose: () => void;
}) {
  return (
    <div className="trailer-modal__panel">
      <button type="button" className="trailer-modal__close" onClick={onClose} aria-label="Закрыть">
        ×
      </button>
      <TrailerFrame title={title} embedUrl={embedUrl} />
    </div>
  );
}

function TrailerModalDialog({
  title,
  embedUrl,
  onClose,
}: {
  title: string;
  embedUrl: string;
  onClose: () => void;
}) {
  return (
    <div className="trailer-modal" role="dialog" aria-modal="true" aria-label={`Трейлер: ${title}`}>
      <button type="button" className="trailer-modal__overlay" onClick={onClose} aria-label="Закрыть трейлер" />
      <TrailerModalContent title={title} embedUrl={embedUrl} onClose={onClose} />
    </div>
  );
}

export default function TrailerModal({
  title,
  trailerUrl,
  trailerYouTubeId,
  onClose,
}: Props) {
  const embedUrl = getEmbedUrl(
    trailerUrl,
    trailerYouTubeId
  );

  useCloseOnEscape(onClose);

  if (!embedUrl) {
    return null;
  }

  return <TrailerModalDialog title={title} embedUrl={embedUrl} onClose={onClose} />;
}
