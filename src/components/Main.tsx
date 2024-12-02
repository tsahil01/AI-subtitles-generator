import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, FileAudio, Globe, Languages, Loader2, Subtitles, Wallet, Zap } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { signIn, signOut, useSession } from "next-auth/react";
import { signAndSend } from "@/lib/signAndSend";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { FlipWords } from "./ui/flip-words";
import { HowItWorks } from "./HowItWorks";
import { Features } from "./Features";

export function Main() {
  const { publicKey, signMessage, disconnect } = useWallet();
  const { data: session, status } = useSession();
  const { toast } = useToast();
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
    <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="py-24 pb-32">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block text-primary">Generate AI-Powered</span>
            <span className="block text-primary">
              <FlipWords className="text-indigo-600" words={["Subtitles", "Transcriptions"]} duration={2000} />
            </span>

          </h1>

          <p className="mt-3 mx-auto text-gray-500 sm:text-lg md:mt-5 max-w-sm md:text-lg md:max-w-xl italic">
            Create accurate subtitles for your videos in seconds.
            Powered by advanced AI and secured by Solana Blockchain
          </p>

          <div className="mt-10 flex md:flex-row flex-col justify-center gap-4">
            <Button size="lg" asChild className="bg-indigo-800 text-md font-sans xl:p-7 p-5  rounded-2xl">
              <Link href="#cta">{"Try for Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="border-indigo-800 xl:p-7 p-5 text-md font-sans rounded-2xl" asChild>
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row mx-auto justify-center md:gap-8 gap-4 text-primary/50 mt-10">
            <div className="flex items-center gap-2 mx-auto md:mx-0">
              <FileAudio className="w-5 h-5" />
              <span>99% Accuracy</span>
            </div>
            <div className="flex items-center gap-2 mx-auto md:mx-0">
              <Languages className="w-5 h-5" />
              <span>10+ Languages</span>
            </div>
            <div className="flex items-center gap-2 mx-auto md:mx-0">
              <Clock className="w-5 h-5" />
              <span>Real-time Processing</span>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <HowItWorks />

      <section id="cta" className="py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to Supercharge Your Video Content?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-primary/50">
            Join thousands of content creators who trust our AI to generate
            accurate, timely subtitles and pay seamlessly via Solana.
          </p>
          <div className="mt-8 flex justify-center gap-4 my-auto">
            {status === "loading" && <Loader2 className="animate-spin h-6 w-6" />}
            {!publicKey && status != "loading" && (
              <WalletMultiButton />
            )}
            {publicKey && status != "loading" && !session && (
              <Button size="lg" className="my-auto" onClick={handleSignIn} disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In with Solana"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            {session && (
              <Button size="lg" className="my-auto" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No subscription required. Pay only for what you use.
          </p>
        </div>
      </section>
    </main>
  );
}


