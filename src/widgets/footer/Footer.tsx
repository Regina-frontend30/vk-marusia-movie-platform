import "./Footer.scss";
import spriteUrl from "../../assets/sprite/sprite.svg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <a href="#" className="footer__icon" aria-label="VK">
          <svg aria-hidden="true">
            <use href={`${spriteUrl}#icon-vk`} />
          </svg>
        </a>

        <a href="#" className="footer__icon" aria-label="YouTube">
          <svg aria-hidden="true">
            <use href={`${spriteUrl}#icon-youtube`} />
          </svg>
        </a>

        <a href="#" className="footer__icon" aria-label="OK">
          <svg aria-hidden="true">
            <use href={`${spriteUrl}#icon-ok`} />
          </svg>
        </a>

        <a href="#" className="footer__icon" aria-label="Telegram">
          <svg aria-hidden="true">
            <use href={`${spriteUrl}#icon-telegram`} />
          </svg>
        </a>
      </div>
    </footer>
  );
}
