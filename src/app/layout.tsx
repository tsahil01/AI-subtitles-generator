import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from 'nextjs-toploader';
import { BottomTag } from "@/components/bottomTag";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Subtitles Generator",
  description: "Generate subtitles for your videos using AI",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
        color="purple"
        />
        <Providers>{children}</Providers>
        <Toaster />
        {/* <BottomTag /> */}
      </body>
    </html>
  );
}
