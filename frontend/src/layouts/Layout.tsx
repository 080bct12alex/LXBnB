import Footer from "../components/Footer";
import Header from "../components/Header";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-7 flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
