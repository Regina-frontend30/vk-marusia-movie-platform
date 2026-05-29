import { useState } from "react";
import { Link } from "react-router-dom";

import "./Header.scss";

import logo from "../../assets/logo/logo.svg";
import AuthModal from "../../features/auth/AuthModal";

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link to="/">
            <img src={logo} alt="VK Marusia" className="header__logo" />
          </Link>

          <nav className="header__nav">
            <Link to="/" className="header__link">
              Главная
            </Link>

            <Link to="/genres" className="header__link">
              Жанры
            </Link>
          </nav>

          <div className="header__right">
            <input className="header__search" placeholder="Поиск" />

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
