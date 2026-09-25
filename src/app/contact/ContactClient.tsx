"use client";
import { useState } from "react";
import { MapPin, Mail, Phone, Send, Check, Loader2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Honeypot from "@/components/ui/Honeypot";
import { submitContactForm } from "@/app/actions/formActions";

const info = [
  { Icon: MapPin, t: "Our Office", d: "No 60, Polgolla Watta\nPolgolla, Kandy, Sri Lanka" },
  { Icon: Mail, t: "Email Us", d: "tranquilsrilanka@gmail.com" },
  { Icon: Phone, t: "Call Us", d: "+94 77 979 7597" },
];

const reasons = [
  "Personalised itineraries by local experts",
  "24/7 dedicated support throughout your journey",
  "Authentic experiences off the beaten path",
  "Best-price guarantee for unforgettable memories",
];

export default function Contact() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await submitContactForm(data);
    if (res.success) {
      setDone(true);
      setData({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
    } else {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <PageHero image="/img17.jpg" eyebrow="Get in Touch" title="Let's plan your dream journey" subtitle="Our travel designers are standing by — usually reply within 2 hours." />

      <section className="container-page -mt-16 relative z-10 grid sm:grid-cols-3 gap-4 mb-16">
        {info.map(({ Icon, t, d }) => (
          <div key={t} className="card-surface p-7 hover:shadow-elegant transition">
            <span className="grid place-items-center h-12 w-12 rounded-xl bg-gradient-emerald text-primary-foreground mb-4"><Icon className="h-5 w-5" /></span>
            <h3 className="font-display text-lg font-semibold text-primary-deep">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{d}</p>
          </div>
        ))}
      </section>

      <section className="container-page pb-20 grid lg:grid-cols-2 gap-12">
        <div>
          <p className="eyebrow">Why Tranquil</p>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-4xl text-primary-deep leading-tight">Ready to start your adventure?</h2>
          <div className="gold-divider mt-6" />
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Our travel experts are ready to craft the perfect Sri Lankan experience tailored just for you.
            Share your dreams with us — let's make them real.
          </p>
          <div className="mt-8 card-surface p-7 bg-sand/40">
            <h3 className="font-display font-semibold text-primary-deep mb-5">Why choose us?</h3>
            <ul className="space-y-3">
              {reasons.map((r) => <li key={r} className="flex gap-3 text-sm"><Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />{r}</li>)}
            </ul>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-surface p-7 sm:p-9 shadow-elegant"
        >
          <Honeypot value={data.website} onChange={(v) => setData((p) => ({ ...p, website: v }))} />
          <h3 className="font-display text-xl font-bold text-primary-deep">Send us a message</h3>
          {done && (
            <div className="mt-5 rounded-xl bg-accent-soft text-primary-deep px-4 py-3 text-sm flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" /> Your message has been sent. We'll be in touch soon.
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            {[
              ["name", "Your Name", "text", "name"],
              ["email", "Email Address", "email", "email"],
              ["phone", "Phone Number", "tel", "phone"],
              ["subject", "Subject", "text", "subject"],
            ].map(([n, l, t, k]) => (
              <label key={n} className="block">
                <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">{l}</span>
                <input 
                  required 
                  type={t} 
                  value={(data as any)[k]} 
                  onChange={e => setData(p => ({ ...p, [k]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" 
                />
              </label>
            ))}
            <label className="block sm:col-span-2">
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Your Message</span>
              <textarea required rows={5} value={data.message} onChange={e => setData(p => ({ ...p, message: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
            </label>
          </div>
          <button disabled={loading} className="btn-primary w-full mt-6 flex justify-center items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send message <Send className="h-4 w-4" /></>}
          </button>
        </form>
      </section>

      <div className="h-[420px] w-full">
        <iframe
          title="Tranquil Sri Lanka location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126620.93!2d80.5!3d7.29!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae367fde5b7dd45%3A0x4d0a18a89cb8f04f!2sKandy%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
          className="h-full w-full"
          loading="lazy"
        />
      </div>
    </>
  );
}