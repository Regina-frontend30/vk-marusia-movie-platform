import Header from "../../widgets/header/Header";
import Footer from "../../widgets/footer/Footer";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div>
      <header>
        <Header />
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
