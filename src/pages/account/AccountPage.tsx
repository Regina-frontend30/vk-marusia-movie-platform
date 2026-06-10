import { Link } from "react-router-dom";
import spriteUrl from "../../assets/sprite/sprite.svg";
import "./AccountPage.scss";
import { useAccountPageController } from "../../hooks/useAccountPageController";

function AccountPage() {
  const accountController = useAccountPageController();

  if (accountController.loading) {
    return <div className="container">Loading...</div>;
  }

  if (!accountController.user) {
    return <div className="container">Не авторизован</div>;
  }

  const user = accountController.user;

  const initialsRaw =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.trim();

  const initials = initialsRaw
    ? initialsRaw.toUpperCase()
    : user.email
        .replace(/[^a-zA-Zа-яА-Я]/g, "")
        .slice(0, 2)
        .toUpperCase();

  return (
    <div className="account container">
      <h1 className="account__title">Мой аккаунт</h1>

      <div className="account__tabs">
        <button
          className={`account__tab ${
            accountController.activeTab === "favorites"
              ? "account__tab--active"
              : ""
          }`}
          onClick={() => accountController.setActiveTab("favorites")}
        >
          <svg className="account__tab-icon" aria-hidden="true">
            <use href={`${spriteUrl}#icon-favorites`} />
          </svg>

          <span className="account__tab-text account__tab-text--mobile">
            Избранное
          </span>

          <span className="account__tab-text account__tab-text--desktop">
            Избранные фильмы
          </span>
        </button>

        <button
          className={`account__tab ${
            accountController.activeTab === "settings"
              ? "account__tab--active"
              : ""
          }`}
          onClick={() => accountController.setActiveTab("settings")}
        >
          <svg className="account__tab-icon" aria-hidden="true">
            <use href={`${spriteUrl}#icon-name`} />
          </svg>

          <span className="account__tab-text account__tab-text--mobile">
            Настройки
          </span>

          <span className="account__tab-text account__tab-text--desktop">
            Настройка аккаунта
          </span>
        </button>
      </div>

      {accountController.activeTab === "settings" && (
        <div className="account__settings">
          <div className="account__user">
            <div className="account__info">
              <div className="account__row">
                <div
                  className="account__row-icon account__row-icon--avatar"
                  aria-hidden="true"
                >
                  {initials}
                </div>

                <div className="account__row-content">
                  <div className="account__label">Имя Фамилия</div>

                  <div className="account__value">
                    {accountController.displayName}
                  </div>
                </div>
              </div>

              <div className="account__row">
                <div className="account__row-icon" aria-hidden="true">
                  <svg>
                    <use href={`${spriteUrl}#icon-email`} />
                  </svg>
                </div>

                <div className="account__row-content">
                  <div className="account__label">Электронная почта</div>

                  <div className="account__value">{user.email}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            className="account__logout"
            onClick={accountController.logout}
          >
            Выйти из аккаунта
          </button>
        </div>
      )}

      {accountController.activeTab === "favorites" && (
        <div className="account__favorites">
          {user.favorites && user.favorites.length > 0 ? (
            <div className="account__movies">
              {user.favorites.map((movie) => (
                <div
                  key={movie.id}
                  className="account__movie-card"
                >
                  <Link
                    to={`/movie/${movie.id}`}
                    className="account__movie-link"
                  >
                    <img
                      className="account__movie-image"
                      src={movie.posterUrl}
                      alt={movie.title}
                    />
                  </Link>

                  <button
                    type="button"
                    className="account__movie-remove"
                    aria-label="Удалить из избранного"
                    disabled={
                      accountController.removingFavoriteId ===
                      movie.id
                    }
                    onClick={() =>
                      accountController.removeFavorite(movie.id)
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="account__empty">Нет избранных фильмов</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AccountPage;
