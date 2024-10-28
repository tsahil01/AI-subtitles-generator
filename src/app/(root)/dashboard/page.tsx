"use client";

import { DashboardMain } from "@/components/DashboardMain";
import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();
  if (status === "loading") return <>Loading...</>;
  if (status === "unauthenticated") return router.push("/");
  
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
