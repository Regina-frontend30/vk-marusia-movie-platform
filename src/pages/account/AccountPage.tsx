import { Link } from "react-router-dom";
import spriteUrl from "../../assets/sprite/sprite.svg";
import "./AccountPage.scss";
import { useAccountPageController } from "../../hooks/useAccountPageController";

function AccountPage() {
  const accountPageController = useAccountPageController();

  if (accountPageController.loading) {
    return <div className="container">Loading...</div>;
  }

  if (!accountPageController.user) {
    return <div className="container">Не авторизован</div>;
  }

  const currentUser = accountPageController.user;

  const userInitialsRaw =
    `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}`.trim();

  const userInitials = userInitialsRaw
    ? userInitialsRaw.toUpperCase()
    : currentUser.email
        .replace(/[^a-zA-Zа-яА-Я]/g, "")
        .slice(0, 2)
        .toUpperCase();

  return (
    <div className="account container">
      <h1 className="account__title">Мой аккаунт</h1>

      <div className="account__tabs">
        <button
          className={`account__tab ${
            accountPageController.activeTab === "favorites"
              ? "account__tab--active"
              : ""
          }`}
          onClick={() => accountPageController.setActiveTab("favorites")}
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
            accountPageController.activeTab === "settings"
              ? "account__tab--active"
              : ""
          }`}
          onClick={() => accountPageController.setActiveTab("settings")}
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

      {accountPageController.activeTab === "settings" && (
        <div className="account__settings">
          <div className="account__user">
            <div className="account__info">
              <div className="account__row">
                <div
                  className="account__row-icon account__row-icon--avatar"
                  aria-hidden="true"
                >
                  {userInitials}
                </div>

                <div className="account__row-content">
                  <div className="account__label">Имя Фамилия</div>

                  <div className="account__value">
                    {accountPageController.displayName}
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

                  <div className="account__value">{currentUser.email}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            className="account__logout"
            onClick={accountPageController.logout}
          >
            Выйти из аккаунта
          </button>
        </div>
      )}

      {accountPageController.activeTab === "favorites" && (
        <div className="account__favorites">
          {currentUser.favorites && currentUser.favorites.length > 0 ? (
            <div className="account__movies">
              {currentUser.favorites.map((favoriteMovie) => (
                <div
                  key={favoriteMovie.id}
                  className="account__movie-card"
                >
                  <Link
                    to={`/movie/${favoriteMovie.id}`}
                    className="account__movie-link"
                  >
                    <img
                      className="account__movie-image"
                      src={favoriteMovie.posterUrl}
                      alt={favoriteMovie.title}
                    />
                  </Link>

                  <button
                    type="button"
                    className="account__movie-remove"
                    aria-label="Удалить из избранного"
                    disabled={
                      accountPageController.removingFavoriteId ===
                      favoriteMovie.id
                    }
                    onClick={() =>
                      accountPageController.removeFavorite(favoriteMovie.id)
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
