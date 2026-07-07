import { Hero } from "@/components/Hero";
import { FlavorGrid } from "@/components/FlavorGrid";
import { MiniBoxBuilder } from "@/components/MiniBoxBuilder/MiniBoxBuilder";
import { PackageBuilder } from "@/components/OrderBuilder/PackageBuilder";
import { ContactSection } from "@/components/ContactSection";
import { DeliveryInfo } from "@/components/DeliveryInfo";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <FlavorGrid />
        <MiniBoxBuilder />
        <PackageBuilder />
        <ContactSection />
        <DeliveryInfo />
      </main>
      <Footer />
    </>
  );
}
