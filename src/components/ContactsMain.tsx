"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { contact } from "@/actions/contact";
import { toast } from "@/hooks/use-toast";

export function ContactsMain() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setSubmitting(true);
    event.preventDefault();
    const response = await contact(name, email, subject, message);
    if (response) {
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSubmitting(false);
      toast({
        title: "Success",
        description: "Your message has been sent",
      });
    } else {
      setSubmitting(false);
      toast({
        title: "Error",
        description: "An error occurred while sending your message",
        variant: "destructive",
      });
    }
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required={true}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
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
                  required={true}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  required={true}
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
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
                  required={true}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>
              <div className="flex justify-center">
                <Button type="submit" disabled={submitting ? true : false}>
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
