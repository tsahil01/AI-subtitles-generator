import { ContactsMain } from "@/components/ContactsMain";
import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";

export default function ContactPage() {
    return (
      <div className="flex flex-col min-h-screen w-full mx-auto">
        <TopBar />
        <div className="flex-grow">
          <ContactsMain />
        </div>
        <Footer />
      </div>
    );
  }