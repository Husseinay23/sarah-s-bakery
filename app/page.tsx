import { Hero } from "@/components/Hero";
import { FlavorGrid } from "@/components/FlavorGrid";
import { OrderBuilderTabs } from "@/components/OrderBuilder/OrderBuilderTabs";
import { MiniBoxSpotlight } from "@/components/MiniBoxSpotlight";
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
        <OrderBuilderTabs />
        <MiniBoxSpotlight />
        <DeliveryInfo />
      </main>
      <Footer />
    </>
  );
}
