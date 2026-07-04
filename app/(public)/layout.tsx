import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartModal from "@/components/CartModal";
import NewsletterPopup from "@/components/NewsletterPopup";
import { CartProvider } from "@/lib/cart-context";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Nav />
      {children}
      <Footer />
      <CartModal />
      <NewsletterPopup />
    </CartProvider>
  );
}
