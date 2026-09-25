"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, Loader2, User, Mail, Phone, Calendar, Users, MessageSquare } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Honeypot from "@/components/ui/Honeypot";
import { submitTourBooking } from "@/app/actions/formActions";

export default function ClientPage({ tourSlug, tourTitle, tourImage }: { tourSlug: string; tourTitle: string; tourImage: string }) {
  const router = useRouter();
  
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "", email: "", phone: "", date: "", passengers: "2", requests: "", website: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await submitTourBooking({ ...data, tourSlug });
    if (res.success) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <PageHero 
        image={tourImage} 
        eyebrow="Book Your Adventure" 
        title={`Book ${tourTitle}`} 
        subtitle="Reserve your spot today and let our travel experts handle the rest." 
      />

      <section className="container-page -mt-16 relative z-10 max-w-4xl mb-20">
        <div className="card-surface shadow-elegant overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-emerald text-primary-foreground px-8 py-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-1 block">Reservation</span>
              <h2 className="font-display text-xl sm:text-2xl font-bold">Tour Booking Details</h2>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            {done ? (
              <div className="text-center py-8">
                <span className="inline-grid place-items-center h-20 w-20 rounded-full bg-accent-soft text-accent mb-6">
                  <Check className="h-10 w-10" />
                </span>
                <h3 className="font-display text-3xl font-bold text-primary-deep mb-4">Booking Request Received!</h3>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                  Thank you, <strong>{data.name}</strong>. Your request for <strong>{tourTitle}</strong> on {data.date} has been successfully sent. Our travel designers will review your details and contact you via email shortly.
                </p>
                <div className="mt-10">
                  <button type="button" onClick={() => router.push("/tours")} className="btn-outline">
                    Browse more tours
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Honeypot value={data.website} onChange={(v) => setData((p) => ({ ...p, website: v }))} />
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="block sm:col-span-2">
                    <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Full Name</span>
                    <span className="relative block">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input required type="text" value={data.name} onChange={e => setData(p => ({ ...p, name: e.target.value }))} className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                    </span>
                  </label>

                  <label className="block">
                    <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Email Address</span>
                    <span className="relative block">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input required type="email" value={data.email} onChange={e => setData(p => ({ ...p, email: e.target.value }))} className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                    </span>
                  </label>

                  <label className="block">
                    <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Phone Number</span>
                    <span className="relative block">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input required type="tel" value={data.phone} onChange={e => setData(p => ({ ...p, phone: e.target.value }))} className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                    </span>
                  </label>

                  <label className="block">
                    <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Preferred Travel Date</span>
                    <span className="relative block">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input required type="date" value={data.date} onChange={e => setData(p => ({ ...p, date: e.target.value }))} className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                    </span>
                  </label>

                  <label className="block">
                    <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Number of Passengers</span>
                    <span className="relative block">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input required type="number" min="1" value={data.passengers} onChange={e => setData(p => ({ ...p, passengers: e.target.value }))} className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                    </span>
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 inline-flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" /> Special Requests (Optional)
                    </span>
                    <textarea rows={4} value={data.requests} onChange={e => setData(p => ({ ...p, requests: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" placeholder="Let us know if you have any dietary requirements, room preferences, or specific things you'd like to do..." />
                  </label>
                </div>

                <div className="pt-6 border-t border-border mt-8 flex flex-col-reverse sm:flex-row justify-between gap-4">
                  <button type="button" onClick={() => router.back()} disabled={loading} className="btn-outline">
                    <ChevronLeft className="h-4 w-4" /> Go Back
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Booking Request"} <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
