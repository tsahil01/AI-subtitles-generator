import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { CubeIcon } from "@radix-ui/react-icons";
import { Mic, Globe, Zap, Clock, ArrowRight } from "lucide-react";
import { signAndSend } from "@/lib/signAndSend";

export function TopBar() {
  const { data: session } = useSession();
  const { publicKey, signMessage, disconnect } = useWallet();
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
            <Button onClick={() => {
              signAndSend(publicKey, signMessage, signIn, signOut, disconnect, session, toast);
            }}>Sign In</Button>
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
