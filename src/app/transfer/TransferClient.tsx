"use client";
import { useState } from "react";
import { MapPin, Users, Calendar, Clock, Phone, Mail, User, MessageSquare, Car, Shield, Sparkles, Check, Loader2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Honeypot from "@/components/ui/Honeypot";
import SectionHeader from "@/components/ui/SectionHeader";
import { submitTransferForm } from "@/app/actions/formActions";

const features = [
  { Icon: Car, t: "Modern Fleet", d: "Air-conditioned cars, vans and luxury SUVs — meticulously maintained." },
  { Icon: Shield, t: "Safety First", d: "Vetted English-speaking chauffeurs with clean driving records." },
  { Icon: Sparkles, t: "Meet & Greet", d: "Name board, cold towel, bottled water — welcome the Tranquil way." },
  { Icon: Clock, t: "On Time, Always", d: "Live flight tracking. We're there when you land." },
];

const fleet = [
  { name: "Sedan", pax: "2 pax", lug: "2 bags", img: "/transfer/sedan.webp" },
  { name: "SUV / Crossover", pax: "4 pax", lug: "4 bags", img: "/transfer/suv.webp" },
  { name: "Mini Van", pax: "6 pax", lug: "6 bags", img: "/transfer/van.webp" },
  { name: "Coach", pax: "12+ pax", lug: "12+ bags", img: "/transfer/coach.webp" },
];

const routes = [
  { from: "CMB Airport", to: "Colombo", price: 35, time: "45 min" },
  { from: "CMB Airport", to: "Negombo", price: 25, time: "20 min" },
  { from: "CMB Airport", to: "Kandy", price: 95, time: "3.5 hrs" },
  { from: "CMB Airport", to: "Galle", price: 110, time: "2.5 hrs" },
  { from: "Kandy", to: "Ella", price: 110, time: "5 hrs" },
  { from: "Ella", to: "Yala", price: 95, time: "3 hrs" },
];

export default function Transfer() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "", email: "", phone: "", passengers: "2",
    pickupLocation: "", dropoffLocation: "", pickupDate: "", pickupTime: "", requests: "", website: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await submitTransferForm(data);
    if (res.success) {
      setSuccess(true);
      setData({ name: "", email: "", phone: "", passengers: "2", pickupLocation: "", dropoffLocation: "", pickupDate: "", pickupTime: "", requests: "", website: "" });
    } else {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <PageHero image="/transfer_hero.webp" eyebrow="Transfers" title="Airport & Inter-City Transfers" subtitle="Reliable, comfortable rides across Sri Lanka — booked in 60 seconds." />

      <section className="container-page mt-20 relative z-10 mb-20">
        <form
          onSubmit={handleSubmit}
          className="card-surface shadow-elegant overflow-hidden"
        >
          <Honeypot value={data.website} onChange={(v) => setData((p) => ({ ...p, website: v }))} />
          <div className="bg-gradient-emerald text-primary-foreground px-7 py-6">
            <h2 className="font-display text-xl font-bold">Book your transfer</h2>
            <p className="text-sm text-primary-foreground/75 mt-1">We'll confirm by email within 2 hours.</p>
          </div>
          <div className="p-7 space-y-7">
            {success && (
              <div className="rounded-xl bg-accent-soft text-primary-deep px-4 py-3 text-sm">
                Thank you — your transfer request has been received. We'll be in touch shortly.
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { Icon: User, label: "Full name", type: "text", k: "name" },
                { Icon: Mail, label: "Email", type: "email", k: "email" },
                { Icon: Phone, label: "Phone", type: "tel", k: "phone" },
                { Icon: Users, label: "Passengers", type: "number", k: "passengers" },
                { Icon: MapPin, label: "Pickup location", type: "text", k: "pickupLocation" },
                { Icon: MapPin, label: "Drop-off location", type: "text", k: "dropoffLocation" },
                { Icon: Calendar, label: "Pickup date", type: "date", k: "pickupDate" },
                { Icon: Clock, label: "Pickup time", type: "time", k: "pickupTime" },
              ].map(({ Icon, label, type, k }) => (
                <label key={label} className="block">
                  <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">{label}</span>
                  <span className="relative block">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input 
                      required 
                      type={type} 
                      value={(data as any)[k]} 
                      onChange={(e) => setData(p => ({ ...p, [k]: e.target.value }))}
                      placeholder={type === "text" ? `Enter ${label.toLowerCase()}` : ""} 
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" 
                    />
                  </span>
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 inline-flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5" /> Special requests
                </span>
                <textarea rows={3} value={data.requests} onChange={e => setData(p => ({ ...p, requests: e.target.value }))} placeholder="Child seat, extra luggage…" className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
              </label>
            </div>
            <button disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit booking request"}
            </button>
          </div>
        </form>
      </section>

      <section className="container-page section-y">
        <SectionHeader eyebrow="Why Tranquil Transfers" title={<>Comfort that <span className="italic text-accent">starts</span> at the airport</>} />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ Icon, t, d }) => (
            <div key={t} className="card-surface p-6 text-center hover:shadow-elegant transition">
              <span className="inline-grid place-items-center h-12 w-12 rounded-full bg-accent-soft text-accent mb-3"><Icon className="h-5 w-5" /></span>
              <h3 className="font-display text-lg font-semibold text-primary-deep">{t}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand/40 section-y">
        <div className="container-page">
          <SectionHeader eyebrow="Popular Routes" title={<>Indicative <span className="italic text-accent">prices</span></>} />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((r) => (
              <div key={r.from + r.to} className="card-surface p-5 flex items-center justify-between hover:shadow-elegant transition">
                <div>
                  <div className="font-semibold text-primary-deep">{r.from} → {r.to}</div>
                  <div className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1.5"><Clock className="h-3 w-3" />{r.time}</div>
                </div>
                <div className="font-display text-2xl font-bold text-accent">${r.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page section-y">
        <SectionHeader eyebrow="Our Fleet" title={<>From sedans to <span className="italic text-accent">coaches</span></>} />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fleet.map((f) => (
            <div key={f.name} className="card-surface overflow-hidden hover:shadow-elegant transition">
              <img src={f.img} alt={f.name} className="h-40 w-full object-cover" />
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-primary-deep">{f.name}</h3>
                <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3 text-accent" /> {f.pax}</span>
                  <span>·</span>
                  <span>{f.lug}</span>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="h-3 w-3 text-accent" /> AC throughout</li>
                  <li className="flex items-center gap-2"><Check className="h-3 w-3 text-accent" /> Bottled water</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}