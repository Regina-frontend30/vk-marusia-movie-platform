import Header from "../../widgets/header/Header";
import Footer from "../../widgets/footer/Footer";
import "../../shared/styles/global.scss";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="layout">
      <Header />

      <main className="layout__main">{children}</main>

      <Footer />
    </div>
  );
}
