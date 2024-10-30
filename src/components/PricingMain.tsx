import { ArrowRight, ArrowRightCircle, CheckCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";

export function PricingMain() {
  return (
    <>
      <main className="container mx-auto px-4 py-6 space-y-6 sm:py-8 sm:space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
            Pricing
          </h2>
          <p className="text-xs text-muted-foreground sm:text-lg flex flex-col">
            <span>
              Who needs a mothly subscription when you can pay per use?
            </span>
            {/* <span className="text-sm text-muted-foreground sm:text-base">
              Our pricing is simple and transparent. You only pay for what you
              use.
            </span> */}
          </p>
        </div>

        <div className="relative flex justify-center gap-6 mx-auto">
          <div className="absolute top-0 -translate-y-1/2 bg-purple-900 text-white font-bold py-1 px-3 rounded-full text-sm">
            Currently Free!
          </div>
          <Card className="w-[500px] border-4 border-purple-900">
            <CardHeader>
              <CardTitle>
                <span className="text-muted-foreground text-sm">
                  Pay per use
                </span>
                <div className="flex flex-row gap-4 mt-4">
                  <h4 className="text-5xl">
                    0.05
                    <span className="text-sm"> SOL</span>
                  </h4>
                </div>
              </CardTitle>
              <CardDescription>
                Powered by Solana. Pay only for what you use.
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-3">
                  <CheckCircle className="w-7 h-7 my-auto text-green-600" />
                  <span className="text-lg my-auto font-bold">
                    Generate AI powered Subtitles
                  </span>
                </div>

                <div className="flex flex-row gap-3">
                  <CheckCircle className="w-7 h-7 my-auto text-green-600" />
                  <span className="text-lg my-auto font-bold">
                    Get Full Transcriptions
                  </span>
                </div>

                <div className="flex flex-row gap-3">
                  <CheckCircle className="w-7 h-7 my-auto text-green-600" />
                  <span className="text-lg my-auto font-bold">
                    Multi-Language Support
                  </span>
                </div>

                <div className="flex flex-row gap-3">
                  <CheckCircle className="w-7 h-7 my-auto text-green-600" />
                  <span className="text-lg my-auto font-bold">SRT, VTT</span>
                </div>

                <div className="flex flex-row gap-3">
                  <CheckCircle className="w-7 h-7 my-auto text-green-600" />
                  <span className="text-lg my-auto font-bold">
                    Supports Audio and Video
                  </span>
                </div>

                <div className="flex flex-row gap-3">
                  <CheckCircle className="w-7 h-7 my-auto text-green-600" />
                  <span className="text-lg my-auto font-bold">
                    Pay Securly with Solana
                  </span>
                </div>

                <div className="flex flex-row gap-3">
                  <CheckCircle className="w-7 h-7 my-auto text-green-600" />
                  <span className="text-lg my-auto font-bold">
                    On Demand Support
                  </span>
                </div>

                {/* <div className="flex flex-row gap-3">
                  <X className="w-7 h-7 my-auto text-red-600" />
                  <span className="text-lg my-auto font-bold line-through">
                    Fool customers
                  </span>
                </div> */}
              </div>
            </CardContent>
            <CardFooter className="w-full mt-2 flex-col ">
              <Link href="/#cta" className="w-full mx-4 mt-4 mb-2">
                <Button
                  className="w-full gap-3 text-xl font-bold bg-purple-900 text-white"
                  size={"lg"}
                >
                  Get Started for Free
                  <ArrowRightCircle className="h-6 w-6 font-bold" />
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground flex flex-col">
                Currently Free for a limited time.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}
