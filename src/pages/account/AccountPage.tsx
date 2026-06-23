import { Link } from "react-router-dom";
import spriteUrl from "../../assets/sprite/sprite.svg";
import "./AccountPage.scss";
import { useAccountPageController } from "../../hooks/useAccountPageController";

type AccountPageController = ReturnType<
  typeof useAccountPageController
>;

type AccountPageUser = NonNullable<
  AccountPageController["user"]
>;

type AccountTab = AccountPageController["activeTab"];

type AccountTabButtonProps = {
  activeTab: AccountTab;
  value: AccountTab;
  mobileLabel: string;
  desktopLabel: string;
  iconId: string;
  setActiveTab: AccountPageController["setActiveTab"];
};

type FavoriteMovieCardProps = {
  favoriteMovie: AccountPageUser["favorites"][number];
  removingFavoriteId: number | null;
  removeFavorite: AccountPageController["removeFavorite"];
};

function getUserInitials(currentUser: AccountPageUser) {
  const initials =
    `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}`.trim();

  if (initials) {
    return initials.toUpperCase();
  }

  return currentUser.email
    .replace(/[^a-zA-Zа-яА-Я]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

function AccountTabButton({
  activeTab,
  value,
  mobileLabel,
  desktopLabel,
  iconId,
  setActiveTab,
}: AccountTabButtonProps) {
  return (
    <button
      className={`account__tab ${activeTab === value ? "account__tab--active" : ""}`}
      onClick={() => setActiveTab(value)}
    >
      <svg className="account__tab-icon" aria-hidden="true">
        <use href={`${spriteUrl}#${iconId}`} />
      </svg>
      <span className="account__tab-text account__tab-text--mobile">{mobileLabel}</span>
      <span className="account__tab-text account__tab-text--desktop">{desktopLabel}</span>
    </button>
  );
}

function AccountTabs({
  activeTab,
  setActiveTab,
}: Pick<AccountPageController, "activeTab" | "setActiveTab">) {
  return (
    <div className="account__tabs">
      <AccountTabButton activeTab={activeTab} value="favorites" mobileLabel="Избранное" desktopLabel="Избранные фильмы" iconId="icon-favorites" setActiveTab={setActiveTab} />
      <AccountTabButton activeTab={activeTab} value="settings" mobileLabel="Настройки" desktopLabel="Настройка аккаунта" iconId="icon-name" setActiveTab={setActiveTab} />
    </div>
  );
}

function AccountNameRow({
  displayName,
  userInitials,
}: {
  displayName: string;
  userInitials: string;
}) {
  return (
    <div className="account__row">
      <div className="account__row-icon account__row-icon--avatar" aria-hidden="true">{userInitials}</div>
      <div className="account__row-content">
        <div className="account__label">Имя Фамилия</div>
        <div className="account__value">{displayName}</div>
      </div>
    </div>
  );
}

function AccountEmailRow({ email }: { email: string }) {
  return (
    <div className="account__row">
      <div className="account__row-icon" aria-hidden="true">
        <svg>
          <use href={`${spriteUrl}#icon-email`} />
        </svg>
      </div>
      <div className="account__row-content">
        <div className="account__label">Электронная почта</div>
        <div className="account__value">{email}</div>
      </div>
    </div>
  );
}

function AccountSettings({
  displayName,
  email,
  userInitials,
  logout,
}: {
  displayName: string;
  email: string;
  userInitials: string;
  logout: AccountPageController["logout"];
}) {
  return (
    <div className="account__settings">
      <div className="account__user">
        <div className="account__info">
          <AccountNameRow displayName={displayName} userInitials={userInitials} />
          <AccountEmailRow email={email} />
        </div>
      </div>
      <button className="account__logout" onClick={logout}>Выйти из аккаунта</button>
    </div>
  );
}

function FavoriteMovieCard({
  favoriteMovie,
  removingFavoriteId,
  removeFavorite,
}: FavoriteMovieCardProps) {
  return (
    <div className="account__movie-card">
      <Link to={`/movie/${favoriteMovie.id}`} className="account__movie-link">
        <img className="account__movie-image" src={favoriteMovie.posterUrl} alt={favoriteMovie.title} />
      </Link>
      <button type="button" className="account__movie-remove" aria-label="Удалить из избранного" disabled={removingFavoriteId === favoriteMovie.id} onClick={() => removeFavorite(favoriteMovie.id)}>
        ×
      </button>
    </div>
  );
}

function AccountFavorites({
  favorites,
  removingFavoriteId,
  removeFavorite,
}: {
  favorites: AccountPageUser["favorites"];
  removingFavoriteId: number | null;
  removeFavorite: AccountPageController["removeFavorite"];
}) {
  if (favorites.length === 0) {
    return <div className="account__empty">Нет избранных фильмов</div>;
  }

  return (
    <div className="account__movies">
      {favorites.map((favoriteMovie) => (
        <FavoriteMovieCard key={favoriteMovie.id} favoriteMovie={favoriteMovie} removingFavoriteId={removingFavoriteId} removeFavorite={removeFavorite} />
      ))}
    </div>
  );
}

function AccountPageContent({
  accountPageController,
  currentUser,
  userInitials,
}: {
  accountPageController: AccountPageController;
  currentUser: AccountPageUser;
  userInitials: string;
}) {
  return accountPageController.activeTab === "settings" ? (
    <AccountSettings displayName={accountPageController.displayName} email={currentUser.email} userInitials={userInitials} logout={accountPageController.logout} />
  ) : (
    <div className="account__favorites">
      <AccountFavorites favorites={currentUser.favorites} removingFavoriteId={accountPageController.removingFavoriteId} removeFavorite={accountPageController.removeFavorite} />
    </div>
  );
}

function AccountPageLoaded({
  accountPageController,
}: {
  accountPageController: AccountPageController;
}) {
  if (!accountPageController.user) {
    return <div className="container">Не авторизован</div>;
  }

  const currentUser = accountPageController.user;
  const userInitials = getUserInitials(currentUser);

  return (
    <div className="account container">
      <h1 className="account__title">Мой аккаунт</h1>
      <AccountTabs activeTab={accountPageController.activeTab} setActiveTab={accountPageController.setActiveTab} />
      <AccountPageContent accountPageController={accountPageController} currentUser={currentUser} userInitials={userInitials} />
    </div>
  );
}

function AccountPage() {
  const accountPageController = useAccountPageController();

  if (accountPageController.loading) {
    return <div className="container">Loading...</div>;
  }

  return <AccountPageLoaded accountPageController={accountPageController} />;
}

export default AccountPage;
