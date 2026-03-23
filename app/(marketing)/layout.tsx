import Navbar from "./_components/Navbar";
import { Footer } from "./_components/CtaAndFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
