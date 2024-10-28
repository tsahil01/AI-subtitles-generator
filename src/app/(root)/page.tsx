"use client";

import { Footer } from "@/components/Footer";
import { Main } from "@/components/Main";
import { TopBar } from "@/components/TopBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full mx-auto">
      <TopBar />
      <div className="flex-grow">
        <Main />
      </div>
      <Footer />
    </div>
  );
}
