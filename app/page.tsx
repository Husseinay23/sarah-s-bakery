import { Hero } from "@/components/Hero";
import { AnnouncementsBar } from "@/components/AnnouncementsBar";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedFlavorSpotlight } from "@/components/FeaturedFlavorSpotlight";
import { FlavorStrip } from "@/components/FlavorStrip";
import { MiniBoxBuilder } from "@/components/MiniBoxBuilder/MiniBoxBuilder";
import { PackageBuilder } from "@/components/OrderBuilder/PackageBuilder";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <AnnouncementsBar />
      <main className="pb-20 md:pb-0">
        <Hero />
        <HowItWorks />
        <FeaturedFlavorSpotlight />
        <FlavorStrip />
        <MiniBoxBuilder />
        <PackageBuilder />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
