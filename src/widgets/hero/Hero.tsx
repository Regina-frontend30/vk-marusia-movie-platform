import "./Hero.scss";
import poster from "../../assets/images/hero.jpg";
import spriteUrl from "../../assets/sprite/sprite.svg";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__info">
          <div className="hero__meta">
            <span className="hero__rating">★ 7.5</span>
            <span className="hero__year">1979</span>
            <span className="hero__genres">детектив</span>
            <span className="hero__runtime">1 ч 7 мин</span>
          </div>

          <h1 className="hero__title">
            Шерлок Холмс и доктор Ватсон: Знакомство
          </h1>

          <p className="hero__description">
            Увлекательные приключения самого известного сыщика всех времен
          </p>

          <div className="hero__actions">
            <button className="hero__button hero__button--primary">
              Трейлер
            </button>

            <button className="hero__button hero__button--secondary">
              О фильме
            </button>

            <div className="hero__icons">
              <button
                type="button"
                aria-label="В избранное"
                className="hero__icon-btn"
              >
                <svg aria-hidden="true">
                  <use href={`${spriteUrl}#icon-favorites`} />
                </svg>
              </button>

              <button
                type="button"
                aria-label="Обновить"
                className="hero__icon-btn"
              >
                <svg aria-hidden="true">
                  <use href={`${spriteUrl}#icon-update`} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <img className="hero__image" src={poster} alt="movie" />
      </div>
    </section>
  );
}
