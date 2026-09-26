import type { Metadata } from "next";
import TransferClient from "./TransferClient";

export const metadata: Metadata = {
  title: "Airport & Inter-City Transfers in Sri Lanka",
  description:
    "Private airport pickups and inter-city transfers across Sri Lanka — CMB airport to Colombo, Negombo, Kandy, Galle, Ella and Yala with English-speaking chauffeurs.",
  alternates: { canonical: "/transfer" },
};

export default function TransferPage() {
  return <TransferClient />;
}
