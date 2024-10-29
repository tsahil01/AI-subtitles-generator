import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Globe, Loader2, Subtitles, Wallet, Zap } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { signIn, signOut, useSession } from "next-auth/react";
import { signAndSend } from "@/lib/signAndSend";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { FlipWords } from "./ui/flip-words";

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
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block text-primary">Generate AI-Powered</span>
            <span className="block text-primary">
              <FlipWords words={["Subtitles", "Transcriptions"]} duration={2000} />
            </span>

          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create accurate subtitles for your videos in seconds. Powered by
            advanced AI and secured by{" "}
            <span className="text-black underline">Solana Blockchain</span>
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="#features">Explore Features</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#cta">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-16 bg-gray-50 dark:bg-gray-800 rounded-3xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-12">
            Key Features
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Subtitles className="h-10 w-10 text-primary" />}
              title="Get SRT & VTT Files"
              description="Download subtitles in SRT and VTT formats for easy integration."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-yellow-500" />}
              title="Lightning Fast"
              description="Get your subtitles in minutes, not hours. Save time and effort."
            />
            <FeatureCard
              icon={<Wallet className="h-10 w-10 text-green-500" />}
              title="Pay-per-Use Model"
              description="Only pay for what you use, with microtransactions powered by Solana."
            />
          </div>
        </div>
      </section>

      <section id="cta" className="py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to Supercharge Your Video Content?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Join thousands of content creators who trust our AI to generate
            accurate, timely subtitles and pay seamlessly via Solana.
          </p>
          <div className="mt-8 flex justify-center">
          {status === "loading" && <Loader2 className="animate-spin h-6 w-6" />}
            {!publicKey && status!= "loading" && (
              <WalletMultiButton className="!bg-primary hover:!bg-primary-dark text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out transform hover:scale-105" />
            )}
            {publicKey && status!= "loading" && !session && (
              <Button size="lg" onClick={handleSignIn} disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In with Solana"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            {session && (
              <Button size="lg" asChild>
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

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        {description}
      </p>
    </div>
  );
}
