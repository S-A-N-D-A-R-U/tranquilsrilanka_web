import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaYoutube,
  FaPinterest,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const links = {
  Explore: [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "All Tours", to: "/tours" },
    { label: "Things To Do", to: "/things-to-do" },
    { label: "Travel Guide", to: "/travel-guide" },
    { label: "Special Offers", to: "/offers" },
  ],
  Tours: [
    { label: "Cultural Tours", to: "/tours?category=culture" },
    { label: "Adventure Tours", to: "/tours?category=adventure" },
    { label: "Wildlife Safari", to: "/tours?category=wildlife" },
    { label: "Beach Holidays", to: "/tours?category=beach" },
    { label: "Honeymoon Escapes", to: "/tours?category=honeymoon" },
    { label: "Day Excursions", to: "/tours?type=day" },
  ],
  Support: [
    { label: "Contact Us", to: "/contact" },
    { label: "Plan Your Trip", to: "/plan-form" },
    { label: "Transfers", to: "/transfer" },
    { label: "Seat-in-Coach Tours", to: "/seat-in-coach" },
    { label: "Latest News", to: "/blog" },
  ],
};

const socials = [
  { Icon: FaFacebookF, href: "https://www.facebook.com/TranquilSrilankaTours", label: "Facebook" },
  { Icon: FaInstagram, href: "https://www.instagram.com/tranquil_srilanka/", label: "Instagram" },
  { Icon: FaYoutube, href: "https://www.youtube.com/@tranquilsrilanka", label: "YouTube" },
  { Icon: FaPinterest, href: "https://www.pinterest.com/tranquilsl", label: "Pinterest" },
  { Icon: FaWhatsapp, href: "https://wa.me/94779797597", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-primary-deep via-blue-900 to-blue-950 text-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-primary blur-3xl" />
      </div>


      {/* Main footer grid */}
      <div className="relative container-page py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">
                Tranquil <span className="text-accent">Sri Lanka</span>
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3" />
            </div>
            <p className="text-white/70 leading-relaxed text-sm">
              Experience the beauty and serenity of Sri Lanka through carefully curated tours, authentic
              encounters, and timeless memories crafted by local experts.
            </p>
            <div className="space-y-3">
              <a href="https://www.google.com/maps/search/?api=1&query=No+60+Polgolla+Watta+Polgolla+Kandy+Sri+Lanka" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sm text-white/80 hover:text-accent transition group">
                <span className="h-9 w-9 rounded-lg bg-white/5 ring-1 ring-white/10 grid place-items-center flex-shrink-0 group-hover:bg-accent/20 transition">
                  <MapPin className="h-4 w-4 text-accent" />
                </span>
                <span className="pt-1.5">No 60, Polgolla Watta, Polgolla, Kandy, Sri Lanka</span>
              </a>
              <a href="tel:+94779797597" className="flex items-center gap-3 text-sm text-white/80 hover:text-accent transition group">
                <span className="h-9 w-9 rounded-lg bg-white/5 ring-1 ring-white/10 grid place-items-center flex-shrink-0 group-hover:bg-accent/20 transition">
                  <Phone className="h-4 w-4 text-accent" />
                </span>
                <span>+94 77 979 7597</span>
              </a>
              <a href="mailto:tranquilsrilanka@gmail.com" className="flex items-center gap-3 text-sm text-white/80 hover:text-accent transition group">
                <span className="h-9 w-9 rounded-lg bg-white/5 ring-1 ring-white/10 grid place-items-center flex-shrink-0 group-hover:bg-accent/20 transition">
                  <Mail className="h-4 w-4 text-accent" />
                </span>
                <span>tranquilsrilanka@gmail.com</span>
              </a>
            </div>

            {/* Socials */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50 mb-3 font-semibold">Follow our journey</p>
              <div className="flex flex-wrap gap-2">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-10 w-10 rounded-full bg-white/5 ring-1 ring-white/10 grid place-items-center text-white/80 hover:bg-accent hover:text-primary-deep hover:scale-110 hover:ring-accent transition-all duration-300"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-display text-lg font-bold text-white mb-5 relative inline-block">
                  {category}
                  <span className="absolute -bottom-2 left-0 h-0.5 w-8 bg-accent rounded-full" />
                </h3>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.to}
                        className="text-sm text-white/70 hover:text-accent transition-all duration-200 inline-flex items-center gap-2 group"
                      >
                        <span className="h-1 w-1 rounded-full bg-accent/0 group-hover:bg-accent transition-all" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-black/20 backdrop-blur">
        <div className="container-page py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-xs md:text-sm text-center md:text-left">
            © {new Date().getFullYear()} <span className="text-white font-medium">Tranquil Sri Lanka</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/60">
            <Link href="/contact" className="hover:text-accent transition">Contact</Link>
            <a href="/sitemap.xml" className="hover:text-accent transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
