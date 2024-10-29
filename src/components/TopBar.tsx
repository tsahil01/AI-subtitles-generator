import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Mic, Globe, Zap, Clock, ArrowRight, Loader2 } from "lucide-react";
import { signAndSend } from "@/lib/signAndSend";
import { useState } from "react";

export function TopBar() {
  const { data: session, status } = useSession();
  const { publicKey, signMessage, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signAndSend(publicKey, signMessage, signIn, signOut, disconnect);
    } catch (error) {
      console.error("Sign in failed", error);
      toast({
        title: "Sign In Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
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
              href="/dashboard"
            >
              Dashboard
            </Link>
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
          {status === "loading" && <Loader2 className="animate-spin h-6 w-6" />}

          {!publicKey && status!= "loading"  && <WalletMultiButton />}
          {publicKey && status!= "loading"  && !session && (
            <>
              <Button size={'lg'} className="hidden md:flex" onClick={handleSignIn} disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In with Solana"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </>
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
