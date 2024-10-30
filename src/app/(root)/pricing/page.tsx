import { Footer } from "@/components/Footer";
import { PricingMain } from "@/components/PricingMain";
import { TopBar } from "@/components/TopBar";

export default function PricingPage() {
    return (
      <div className="flex flex-col min-h-screen w-full mx-auto">
        <TopBar />
        <div className="flex-grow">
          <PricingMain />
        </div>
        <Footer />
      </div>
    );
  }