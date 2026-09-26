import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — Plan Your Sri Lanka Tour",
  description:
    "Talk to our Kandy-based travel team. Call +94 77 979 7597, email tranquilsrilanka@gmail.com or send a message — we usually reply within 2 hours.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ subject?: string | string[] }> }) {
  // Pre-fill the subject when coming from an activity or offer ("Book this experience")
  const { subject } = await searchParams;
  const defaultSubject = typeof subject === "string" ? subject.slice(0, 200) : "";

  return <ContactClient defaultSubject={defaultSubject} />;
}
