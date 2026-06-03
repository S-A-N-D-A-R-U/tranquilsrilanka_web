import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tranquilsrilanka.com"),
  title: "Tranquil Sri Lanka — Tours & Travel | Pearl of the Indian Ocean",
  description:
    "Plan your dream Sri Lanka tour with Tranquil Sri Lanka. Tailor-made tours, day excursions, transfers, and authentic island experiences.",
  openGraph: {
    title: "Tranquil Sri Lanka — Tours & Travel",
    description: "Plan your dream Sri Lanka tour with Tranquil Sri Lanka.",
    url: "https://www.tranquilsrilanka.com",
    siteName: "Tranquil Sri Lanka",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Tranquil Sri Lanka",
  url: "https://www.tranquilsrilanka.com",
  logo: "https://www.tranquilsrilanka.com/favicon.ico",
  image: "https://www.tranquilsrilanka.com/favicon.ico",
  description: "Plan your dream Sri Lanka tour with Tranquil Sri Lanka. Tailor-made tours, day excursions, transfers, and authentic island experiences.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No 60, Polgolla Watta",
    addressLocality: "Polgolla, Kandy",
    addressRegion: "Central Province",
    addressCountry: "LK"
  },
  telephone: "+94779797597",
  email: "tranquilsrilanka@gmail.com",
  sameAs: [
    "https://www.facebook.com/TranquilSrilankaTours",
    "https://www.instagram.com/tranquil_srilanka/",
    "https://www.youtube.com/@tranquilsrilanka",
    "https://www.pinterest.com/tranquilsl"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfairDisplay.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-[100dvh] flex flex-col font-sans text-foreground bg-background antialiased">
        <Navbar />
        {children}
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
