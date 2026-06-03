import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/94779797597?text=Hi%20Tranquil%20Sri%20Lanka%2C%20I%27d%20like%20to%20plan%20a%20trip."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
      <span className="relative h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-elegant grid place-items-center transition-transform group-hover:scale-110">
        <FaWhatsapp className="h-7 w-7" />
      </span>
    </a>
  );
}