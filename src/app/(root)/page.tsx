"use client";

import { Footer } from "@/components/Footer";
import { Main } from "@/components/Main";
import { TopBar } from "@/components/TopBar";

export default function Home() {
  return (
    <>
      <div className="flex flex-col w-full mx-auto">
        <TopBar />
        <Main />
        <Footer/>
      </div>
    </>
  );
}
