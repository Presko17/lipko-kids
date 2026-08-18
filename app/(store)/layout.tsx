import { CartProvider } from "@/lib/cart";
import { getSettings } from "@/lib/settings";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Toaster from "@/components/Toaster";
import CookieBanner from "@/components/CookieBanner";

// Storefront chrome (nav, footer, cart). Admin routes live outside this group,
// so they don't inherit the store's header/footer.
export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <CartProvider freeOver={settings.freeShippingThreshold} shipRate={settings.shippingRate}>
      <Nav />
      {children}
      <Footer />
      <Toaster />
      <CookieBanner />
    </CartProvider>
  );
}
