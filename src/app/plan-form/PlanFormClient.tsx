"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Honeypot from "@/components/ui/Honeypot";
import { submitPlanForm } from "@/app/actions/formActions";

const interests = ["Nature", "History & Culture", "Beach & Relaxation", "Adventure", "Wildlife Safari", "Wellness", "Local Food", "Festivals", "Hiking", "Water Sports"];
const accommodationTypes = ["Villas", "Standard Hotels", "3-star Hotels", "4-star Hotels", "5-star Hotels", "Home Stays"];
const budgets = ["$500 - $1000", "$1000 - $2000", "$2000 - $3000", "$3000+"];

export default function PlanForm() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    arrival: "", departure: "", adults: "2", children: "",
    interests: [] as string[], accommodation: [] as string[], budget: "", notes: "", website: "",
  });

  const handleFinalSubmit = async () => {
    setLoading(true);
    const res = await submitPlanForm(data);
    if (res.success) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const toggle = (key: "interests" | "accommodation", v: string) =>
    setData((p) => ({ ...p, [key]: p[key].includes(v) ? p[key].filter((x) => x !== v) : [...p[key], v] }));

  return (
    <>
      <PageHero image="/img20.jpg" eyebrow="Tailor-made" title="Plan your dream Sri Lankan journey" subtitle="Tell us about you. We'll send back a personalised itinerary within 48 hours." />

      <section className="container-page mt-16 relative z-10 mb-20">
        <div className="card-surface p-6 sm:p-10 shadow-elegant max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-3">
                <span className={`h-8 w-8 rounded-full grid place-items-center text-xs font-bold ${
                  step >= s ? "bg-gradient-gold text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>{s}</span>
                <span className={`text-xs uppercase tracking-widest font-semibold ${step >= s ? "text-primary-deep" : "text-muted-foreground"}`}>
                  {s === 1 ? "Your details" : "Review"}
                </span>
                {s < 2 && <div className={`flex-1 h-px ${step > s ? "bg-accent" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {done ? (
            <div className="text-center py-12">
              <span className="inline-grid place-items-center h-16 w-16 rounded-full bg-accent-soft text-accent mb-5"><Check className="h-7 w-7" /></span>
              <h2 className="font-display text-3xl font-bold text-primary-deep">Thank you, {data.firstName || "traveller"}!</h2>
              <p className="mt-3 text-muted-foreground max-w-md mx-auto">Your request has been received. Our travel designers will reach out within 48 hours with a personalised itinerary.</p>
            </div>
          ) : step === 1 ? (
            <form
              onSubmit={(e) => { e.preventDefault(); setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="space-y-10"
            >
              <Honeypot value={data.website} onChange={(v) => setData((p) => ({ ...p, website: v }))} />
              <div>
                <h3 className="font-display text-xl font-semibold text-primary-deep mb-5">About you</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ["firstName", "First name", "text"],
                    ["lastName", "Last name", "text"],
                    ["email", "Email", "email"],
                    ["phone", "Phone", "tel"],
                  ].map(([k, l, t]) => (
                    <label key={k} className="block">
                      <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">{l}</span>
                      <input required type={t} value={(data as any)[k]} onChange={(e) => setData((p) => ({ ...p, [k]: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-primary-deep mb-5">Travel details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block"><span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Arrival</span><input required type="date" value={data.arrival} onChange={(e) => setData((p) => ({ ...p, arrival: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></label>
                  <label className="block"><span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Departure</span><input required type="date" value={data.departure} onChange={(e) => setData((p) => ({ ...p, departure: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></label>
                  <label className="block"><span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Adults</span><select value={data.adults} onChange={(e) => setData((p) => ({ ...p, adults: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent">{[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}</select></label>
                  <label className="block"><span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Children & ages</span><input value={data.children} onChange={(e) => setData((p) => ({ ...p, children: e.target.value }))} placeholder="e.g. 2 (5 & 8 years)" className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent" /></label>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-primary-deep mb-5">Your interests</h3>
                <div className="flex flex-wrap gap-2">
                  {interests.map((i) => (
                    <button key={i} type="button" onClick={() => toggle("interests", i)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${data.interests.includes(i) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent-soft hover:text-primary-deep"}`}>{i}</button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-primary-deep mb-5">Accommodation</h3>
                <div className="flex flex-wrap gap-2">
                  {accommodationTypes.map((a) => (
                    <button key={a} type="button" onClick={() => toggle("accommodation", a)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${data.accommodation.includes(a) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent-soft hover:text-primary-deep"}`}>{a}</button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-primary-deep mb-5">Budget per person</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {budgets.map((b) => (
                    <button key={b} type="button" onClick={() => setData((p) => ({ ...p, budget: b }))} className={`px-4 py-3 rounded-xl text-sm font-medium transition ${data.budget === b ? "bg-gradient-emerald text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent-soft hover:text-primary-deep"}`}>{b}</button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Anything else? (dietary needs, must-see places…)</span>
                <textarea rows={4} value={data.notes} onChange={(e) => setData((p) => ({ ...p, notes: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
              </label>

              <div className="flex justify-end">
                <button className="btn-primary">Review request <ChevronRight className="h-4 w-4" /></button>
              </div>
            </form>
          ) : (
            <div className="space-y-7">
              <h3 className="font-display text-xl font-semibold text-primary-deep">Review & submit</h3>
              <div className="bg-sand/40 rounded-2xl p-6 space-y-5 text-sm">
                <div><div className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-1">Traveller</div>{data.firstName} {data.lastName} · {data.email} · {data.phone || "—"}</div>
                <div><div className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-1">Travel</div>Arrival {data.arrival || "—"} → Departure {data.departure || "—"} · {data.adults} adults · {data.children || "no children"}</div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-2">Interests</div>
                  <div className="flex flex-wrap gap-1.5">{data.interests.length ? data.interests.map(i => <span key={i} className="px-2.5 py-1 rounded-full bg-card text-xs">{i}</span>) : "—"}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-2">Accommodation</div>
                  <div className="flex flex-wrap gap-1.5">{data.accommodation.length ? data.accommodation.map(a => <span key={a} className="px-2.5 py-1 rounded-full bg-card text-xs">{a}</span>) : "—"}</div>
                </div>
                <div><div className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-1">Budget</div>{data.budget || "—"}</div>
                {data.notes && <div><div className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-1">Notes</div>{data.notes}</div>}
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-outline" disabled={loading}><ChevronLeft className="h-4 w-4" /> Back</button>
                <button type="button" onClick={handleFinalSubmit} disabled={loading} className="btn-primary">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit request"} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
