"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/seat-in-coach", label: "Seat in Coach" },
  { to: "/things-to-do", label: "Things to Do" },
  { to: "/offers", label: "Offers" },
  { to: "/transfer", label: "Transfer" },
  { to: "/travel-guide", label: "Travel Guide" },
  { to: "/blog", label: "News & Blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setTourOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  // Always solid (white) when not on the home page so text stays visible.
  const solid = scrolled || pathname !== "/";

  const closeMenus = () => {
    setTourOpen(false);
    setMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(path));

  const getLinkClass = (path: string) => {
    const active = isActive(path);
    const base = "transition-all duration-300 text-[15px] font-medium tracking-wide relative py-1";
    
    if (solid) {
      return `${base} ${active ? "text-primary" : "text-gray-700 hover:text-primary"} ${active ? "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary" : "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-primary/50 after:transition-all after:duration-300"}`;
    } else {
      return `${base} ${active ? "text-white drop-shadow-md" : "text-white/90 hover:text-white drop-shadow-sm"} ${active ? "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-white" : "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-white/60 after:transition-all after:duration-300"}`;
    }
  };

  return (
    <nav
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        solid ? "bg-white shadow-lg" : "bg-white/10 backdrop-blur-md border-b border-white/20"
      }`}
    >
      <div className="max-w-7xl mx-auto flex">
        {/* Logo */}
        <div className={`w-[200px] border-r transition-colors duration-300 flex items-center justify-center ${solid ? "border-gray-100" : "border-white/20"}`}>
          <Link href="/" className="block p-1">
            <img 
              src="/logo.png" 
              alt="Tranquil Sri Lanka" 
              className={`h-16 w-32 object-contain transition-all duration-300 ${!solid ? "drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] scale-105" : ""}`} 
            />
          </Link>
        </div>

        <div className="flex-1">
          {/* Top bar */}
          <div className={`border-b transition-colors duration-300 ${solid ? "border-gray-100" : "border-white/20"}`}>
            <div className={`flex justify-end items-center h-8 px-4 space-x-4 text-sm transition-colors ${solid ? "text-gray-500" : "text-white drop-shadow-md"}`}>
              <a href="mailto:tranquilsrilanka@gmail.com" className={`flex items-center gap-1 ${solid ? "hover:text-primary" : "hover:text-white/80"}`}>
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">tranquilsrilanka@gmail.com</span>
              </a>
              <a href="tel:+94779797597" className={`flex items-center gap-1 ${solid ? "hover:text-primary" : "hover:text-white/80"}`}>
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">+94 77 979 7597</span>
              </a>
            </div>
          </div>

          {/* Main nav */}
          <div className="px-4 flex items-center justify-between h-12">
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className={getLinkClass("/")}>Home</Link>
              <div
                className="relative"
                onMouseEnter={() => setTourOpen(true)}
                onMouseLeave={() => setTourOpen(false)}
              >
                <Link href="/tours" className={`flex items-center ${getLinkClass("/tours")}`}>
                  Tours <ChevronDown className="w-4 h-4 ml-1" />
                </Link>
                {/* Always rendered so crawlers can follow the links; shown on hover */}
                <div className={`absolute top-full left-0 w-48 bg-white shadow-lg py-2 rounded-b-md border-t-2 border-primary overflow-hidden ${tourOpen ? "" : "hidden"}`}>
                    <Link href="/tours?type=round" onClick={closeMenus} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Round Tours</Link>
                    <Link href="/tours?type=day" onClick={closeMenus} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Day Tours</Link>
                </div>
              </div>
              {navLinks.slice(1).map((l) => (
                <Link key={l.to} href={l.to} className={getLinkClass(l.to)}>{l.label}</Link>
              ))}
            </div>

            <Link href="/contact"
              className={`hidden lg:block px-5 py-1.5 font-medium rounded-md transition-all duration-300 ${
                solid ? "bg-primary text-white hover:bg-primary-deep shadow-md hover:shadow-lg" : "bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              }`}
            >
              Contact Us
            </Link>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`lg:hidden p-2 rounded-md ml-auto transition-colors ${
                solid ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/20 text-white drop-shadow-md"
              }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-[280px] bg-white transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close menu">
            <X size={24} className="text-gray-600" />
          </button>
          <div className="p-4 pt-16 overflow-y-auto h-full">
            <div className="flex flex-col space-y-4">
              <Link href="/" className={`p-2 rounded-md transition-colors ${isActive("/") ? "bg-primary/10 text-primary font-semibold" : "text-gray-700 hover:text-primary hover:bg-gray-50"}`}>Home</Link>
              <div>
                <button onClick={() => setTourOpen((v) => !v)} className={`w-full p-2 text-left rounded-md flex items-center justify-between transition-colors ${isActive("/tours") ? "bg-primary/10 text-primary font-semibold" : "text-gray-700 hover:text-primary hover:bg-gray-50"}`}>
                  Tours <ChevronDown className={`w-4 h-4 transform transition-transform ${tourOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`pl-4 mt-2 space-y-2 border-l-2 border-gray-100 ml-2 ${tourOpen ? "" : "hidden"}`}>
                    <Link href="/tours?type=round" onClick={closeMenus} className="block w-full p-2 text-left text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors">Round Tours</Link>
                    <Link href="/tours?type=day" onClick={closeMenus} className="block w-full p-2 text-left text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors">Day Tours</Link>
                </div>
              </div>
              {navLinks.slice(1).map((l) => (
                <Link key={l.to} href={l.to} className={`p-2 rounded-md transition-colors ${isActive(l.to) ? "bg-primary/10 text-primary font-semibold" : "text-gray-700 hover:text-primary hover:bg-gray-50"}`}>{l.label}</Link>
              ))}
              <Link href="/contact" className={`p-2 rounded-md text-center transition-colors ${isActive("/contact") ? "bg-primary-deep text-white font-semibold" : "bg-primary text-white hover:bg-primary-deep"}`}>Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}