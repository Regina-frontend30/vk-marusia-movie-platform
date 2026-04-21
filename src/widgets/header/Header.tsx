import "./Header.scss";
import logo from "../../assets/logo/logo.svg";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        {}
        <Link to="/">
          <img src={logo} alt="VK Marusia" className="header__logo" />
        </Link>

        <nav className="header__nav">
          <Link to="/" className="header__link">Главная</Link>
          <Link to="/genres" className="header__link">Жанры</Link>
        </nav>

        <div className="header__right">
          <input className="header__search" placeholder="Поиск" />

          <Link to="/login" className="header__link">
            Войти
          </Link>
        </div>
      </div>
    </header>
  );
}