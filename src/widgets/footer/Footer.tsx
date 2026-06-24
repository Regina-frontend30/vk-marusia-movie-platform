import "./Footer.scss";
import spriteUrl from "../../assets/sprite/sprite.svg";

const footerLinks = [
  { label: "VK", iconId: "icon-vk" },
  { label: "YouTube", iconId: "icon-youtube" },
  { label: "OK", iconId: "icon-ok" },
  { label: "Telegram", iconId: "icon-telegram" },
];

function FooterIconLink({
  label,
  iconId,
}: {
  label: string;
  iconId: string;
}) {
  return (
    <a href="#" className="footer__icon" aria-label={label}>
      <svg aria-hidden="true">
        <use href={`${spriteUrl}#${iconId}`} />
      </svg>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        {footerLinks.map((footerLink) => (
          <FooterIconLink key={footerLink.label} label={footerLink.label} iconId={footerLink.iconId} />
        ))}
      </div>
    </footer>
  );
}
