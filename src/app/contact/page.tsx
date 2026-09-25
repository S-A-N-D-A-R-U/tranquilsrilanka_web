import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — Plan Your Sri Lanka Tour",
  description:
    "Talk to our Kandy-based travel team. Call +94 77 979 7597, email tranquilsrilanka@gmail.com or send a message — we usually reply within 2 hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
