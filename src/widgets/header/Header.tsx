import "../../shared/styles/Header.scss";
import logo from "../../assets/logo/logo.svg";

export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        
        <img src={logo} alt="VK Marusia" className="header__logo" />

        <nav className="header__nav">
          <a className="header__link">Главная</a>
          <a className="header__link">Жанры</a>
        </nav>

        <div className="header__right">
          <input className="header__search" placeholder="Поиск" />
          <button className="header__link">Войти</button>
        </div>

      </div>
    </header>
  );
}