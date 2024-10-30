"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function ContactsMain() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log({ name, email, subject, message });
    
  }

  return (
    <>
      <main className="container mx-auto px-4 py-6 space-y-6 sm:py-8 sm:space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
            Contact
          </h2>
          <p className="text-xs text-muted-foreground sm:text-lg flex flex-col">
            <span>
                We are here to help you with any questions you may have. Reach out
                to us and we will respond as soon as we can.
            </span>
          </p>
        </div>
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required = {true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email"
                  required = {true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-semibold">
                  Subject
                </Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="subject"
                  required = {true}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold">
                  Message
                </Label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="message"
                  required = {true}
                />
              </div>
              <div className="flex justify-center">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
