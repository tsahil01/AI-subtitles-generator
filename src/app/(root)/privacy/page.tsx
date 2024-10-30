import { Footer } from "@/components/Footer";
import { PrivacyMain } from "@/components/PrivacyMain";
import { TopBar } from "@/components/TopBar";

export default function PricingPage() {
    return (
      <div className="flex flex-col min-h-screen w-full mx-auto">
        <TopBar />
        <div className="flex-grow">
          <PrivacyMain />
        </div>
        <Footer />
      </div>
    );
  }