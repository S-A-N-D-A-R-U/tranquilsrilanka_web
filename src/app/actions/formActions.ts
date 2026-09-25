"use server";
import { z } from "zod";
import { sendEmail, emailRows } from "@/lib/mailer";
import { getTourBySlug } from "@/lib/api";

type ActionResult = { success: boolean; error?: string };

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => text(max).min(1);
const email = z.string().trim().max(254).pipe(z.email());
const phone = text(40);
// Hidden field that real users never fill — bots usually do.
const honeypot = z.string().max(0).optional();

const planSchema = z.object({
  firstName: required(80),
  lastName: required(80),
  email,
  phone,
  arrival: text(40),
  departure: text(40),
  adults: text(10),
  children: text(10),
  interests: z.array(text(60)).max(20).default([]),
  accommodation: z.array(text(60)).max(20).default([]),
  budget: text(40),
  notes: text(5000),
  website: honeypot,
});

const transferSchema = z.object({
  name: required(120),
  email,
  phone,
  passengers: text(10),
  pickupLocation: required(200),
  dropoffLocation: required(200),
  pickupDate: text(40),
  pickupTime: text(40),
  requests: text(5000),
  website: honeypot,
});

const contactSchema = z.object({
  name: required(120),
  email,
  phone,
  subject: text(200),
  message: required(5000),
  website: honeypot,
});

const bookingSchema = z.object({
  tourSlug: required(200),
  name: required(120),
  email,
  phone,
  date: text(40),
  passengers: text(10),
  requests: text(5000),
  website: honeypot,
});

const INVALID: ActionResult = { success: false, error: "Please check the form and try again." };

/**
 * Validate input. Honeypot hits return a fake success so bots don't retry;
 * other invalid input returns an error.
 */
function parse<T extends z.ZodTypeAny>(schema: T, data: unknown): { ok: true; data: z.infer<T> } | { ok: false; result: ActionResult } {
  const res = schema.safeParse(data);
  if (res.success) return { ok: true, data: res.data };
  const botHit = res.error.issues.some((i) => i.path[0] === "website");
  return { ok: false, result: botHit ? { success: true } : INVALID };
}

// Plan Form Action
export async function submitPlanForm(input: unknown): Promise<ActionResult> {
  const parsed = parse(planSchema, input);
  if (!parsed.ok) return parsed.result;
  const d = parsed.data;

  const html = `
    <h2>New Tailor-made Trip Request</h2>
    ${emailRows([
      ["Name", `${d.firstName} ${d.lastName}`],
      ["Email", d.email],
      ["Phone", d.phone],
      ["Arrival", d.arrival],
      ["Departure", d.departure],
      ["Adults", d.adults],
      ["Children", d.children || "None"],
      ["Interests", d.interests.join(", ")],
      ["Accommodation", d.accommodation.join(", ")],
      ["Budget", d.budget],
      ["Notes", d.notes],
    ])}
  `;
  return sendEmail(`New Trip Plan Request from ${d.firstName} ${d.lastName}`, html, d.email);
}

// Transfer Form Action
export async function submitTransferForm(input: unknown): Promise<ActionResult> {
  const parsed = parse(transferSchema, input);
  if (!parsed.ok) return parsed.result;
  const d = parsed.data;

  const html = `
    <h2>New Transfer Booking Request</h2>
    ${emailRows([
      ["Name", d.name],
      ["Email", d.email],
      ["Phone", d.phone],
      ["Passengers", d.passengers],
      ["Pickup Location", d.pickupLocation],
      ["Drop-off Location", d.dropoffLocation],
      ["Pickup Date", d.pickupDate],
      ["Pickup Time", d.pickupTime],
      ["Special Requests", d.requests],
    ])}
  `;
  return sendEmail(`New Transfer Booking from ${d.name}`, html, d.email);
}

// Contact Form Action
export async function submitContactForm(input: unknown): Promise<ActionResult> {
  const parsed = parse(contactSchema, input);
  if (!parsed.ok) return parsed.result;
  const d = parsed.data;

  const html = `
    <h2>New Contact Message</h2>
    ${emailRows([
      ["Name", d.name],
      ["Email", d.email],
      ["Phone", d.phone],
      ["Subject", d.subject],
      ["Message", d.message],
    ])}
  `;
  return sendEmail(`New Contact Message from ${d.name}: ${d.subject}`, html, d.email);
}

// Tour Booking Action
export async function submitTourBooking(input: unknown): Promise<ActionResult> {
  const parsed = parse(bookingSchema, input);
  if (!parsed.ok) return parsed.result;
  const d = parsed.data;

  // Look the tour up server-side rather than trusting a title sent by the client
  const tour = await getTourBySlug(d.tourSlug);
  if (!tour) return INVALID;

  const html = `
    <h2>New Tour Booking Request</h2>
    ${emailRows([
      ["Tour", tour.title],
      ["Name", d.name],
      ["Email", d.email],
      ["Phone", d.phone],
      ["Travel Date", d.date],
      ["Passengers", d.passengers],
      ["Special Requests", d.requests],
    ])}
  `;
  return sendEmail(`New Tour Booking for: ${tour.title}`, html, d.email);
}
