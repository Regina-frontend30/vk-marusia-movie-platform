import { useEffect } from "react";

import "./TrailerModal.scss";

type Props = {
  title: string;
  trailerUrl?: string;
  trailerYouTubeId?: string;
  onClose: () => void;
};

function getEmbedUrl(
  trailerUrl?: string,
  trailerYouTubeId?: string
) {
  if (trailerYouTubeId) {
    return `https://www.youtube.com/embed/${trailerYouTubeId}?autoplay=1&rel=0`;
  }

  if (!trailerUrl) {
    return null;
  }

  const youtubeMatch = trailerUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
  );

  if (youtubeMatch?.[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
  }

  return trailerUrl;
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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  if (!embedUrl) {
    return null;
  }

  return (
    <div
      className="trailer-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Трейлер: ${title}`}
    >
      <button
        type="button"
        className="trailer-modal__overlay"
        onClick={onClose}
        aria-label="Закрыть трейлер"
      />

      <div className="trailer-modal__panel">
        <button
          type="button"
          className="trailer-modal__close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

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
      </div>
    </div>
  );
}
