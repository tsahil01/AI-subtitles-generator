"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-6xl font-bold">
        Welcome to{' '}
        <a className="text-blue-600" href="https://nextjs.org">
          Next.js!
        </a>
        <Button onClick={() => signIn()}>Sign in</Button>
      </h1>
    </div>
  );
}