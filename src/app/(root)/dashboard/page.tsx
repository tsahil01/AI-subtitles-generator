"use client";

import { DashboardMain } from "@/components/DashboardMain";
import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";

export default function Page() {
  return (
    <>
      <div className="flex flex-col w-full mx-auto gap-7">
        <TopBar />
        <DashboardMain />
        <Footer />
      </div>
    </>
  );
}
