import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { CubeIcon } from "@radix-ui/react-icons";
import { Mic, Globe, Zap, Clock, ArrowRight } from "lucide-react";

export function TopBar() {
  const { data: session } = useSession();
  const { publicKey, signMessage, disconnect } = useWallet();

  async function signAndSend() {
    if (!publicKey || !signMessage) return;

    try {
      const message = new TextEncoder().encode("Sign this message");
      const signature = await signMessage(message);
      const signatureHex = Buffer.from(signature).toString("hex");

      console.log("Signature:", signatureHex);
      console.log("Public Key:", publicKey.toString());

      const signInResult = await signIn("credentials", {
        web3Address: publicKey.toString(),
        signature: signatureHex,
        redirect: false,
      });

      if (signInResult?.error) {
        toast({
          title: "Sign In Failed",
          description: signInResult.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed In",
          description: "You have successfully signed in",
        });
      }
    } catch (error) {
      console.error("Failed to sign the message", error);
      toast({
        title: "Sign In Failed",
        description: "Failed to sign the message",
        variant: "destructive",
      });
    }
  }

  return (
    <header className="w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mic className="w-8 h-8" />
          <h1 className="text-xl font-bold">AI Subtitler</h1>
        </div>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#pricing"
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#contact"
            >
              Contact
            </Link>
          </nav>
          {!publicKey && <WalletMultiButton />}
          {publicKey && !session && (
            <Button onClick={signAndSend}>Sign In</Button>
          )}
          {session && (
            <Button
              variant="outline"
              onClick={() => {
                signOut();
                disconnect();
                toast({
                  title: "Signed Out",
                  description:
                    "You have successfully signed out and disconnected your wallet",
                });
              }}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
