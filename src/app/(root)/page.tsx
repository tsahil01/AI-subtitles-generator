"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

export default function Home() {
  // const { data: session, status } = useSession();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-6xl font-bold">
        Welcome to{" "}
        <a className="text-blue-600" href="https://nextjs.org">
          Next.js!
        </a>
      </h1>
      <div>
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      {/* {JSON.stringify(session)} */}
    </div>
  );
}
