"use client";

import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const { publicKey, signMessage, disconnect } = useWallet();

  async function signAndSend() {
    if (!publicKey) return;

    const message = new TextEncoder().encode("Sign this message");
    const signature = await signMessage?.(message);

    if (!signature) {
      console.error("Failed to sign the message");
      return;
    }

    const signatureArray = new Uint8Array(signature);
    const signatureHex = Array.from(signatureArray)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');

    console.log("Signature:", signatureHex);
    console.log("Public Key:", publicKey.toString());

    const signInUser = await signIn("credentials", {
      web3Address: publicKey.toString(),
      signature: signatureHex,
    });

    console.log(signInUser);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-6xl font-bold">
        Welcome to <a className="text-blue-600" href="https://nextjs.org">Next.js!</a>
      </h1>
      <div>
        <WalletMultiButton />
        <WalletDisconnectButton />
        <Button onClick={() => signAndSend()}>Sign In with Wallet</Button> {/* Added button */}
        <Button onClick={() => {
          signOut();
          disconnect();
          }}>Sign Out</Button>
      </div>
      {JSON.stringify(session)}
    </div>
  );
}