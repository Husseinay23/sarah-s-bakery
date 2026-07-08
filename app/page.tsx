import { Hero } from "@/components/Hero";
import { AnnouncementsBar } from "@/components/AnnouncementsBar";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedFlavorSpotlight } from "@/components/FeaturedFlavorSpotlight";
import { FlavorStrip } from "@/components/FlavorStrip";
import { MiniBoxBuilder } from "@/components/MiniBoxBuilder/MiniBoxBuilder";
import { PackageBuilder } from "@/components/OrderBuilder/PackageBuilder";
import { ContactSection } from "@/components/ContactSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
import { JsonLd } from "@/components/JsonLd";
import { getBakerySchema, getFaqSchema, getWebSiteSchema } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      <JsonLd data={[getWebSiteSchema(), getBakerySchema(), getFaqSchema()]} />
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
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
