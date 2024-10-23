"use client";

import { Footer } from "@/components/Footer";
import { Main } from "@/components/Main";
import { TopBar } from "@/components/TopBar";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  
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
