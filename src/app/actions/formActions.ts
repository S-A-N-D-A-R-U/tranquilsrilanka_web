"use server";
import { sendEmail } from "@/lib/mailer";

// Plan Form Action
export async function submitPlanForm(data: any) {
  try {
    const subject = `New Trip Plan Request from ${data.firstName} ${data.lastName}`;
    const html = `
      <h2>New Tailor-made Trip Request</h2>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Arrival:</strong> ${data.arrival}</p>
      <p><strong>Departure:</strong> ${data.departure}</p>
      <p><strong>Adults:</strong> ${data.adults}</p>
      <p><strong>Children:</strong> ${data.children || "None"}</p>
      <p><strong>Interests:</strong> ${data.interests?.join(", ")}</p>
      <p><strong>Accommodation:</strong> ${data.accommodation?.join(", ")}</p>
      <p><strong>Budget:</strong> ${data.budget}</p>
      <p><strong>Notes:</strong> ${data.notes}</p>
    `;
    return await sendEmail(subject, html);
  } catch (error) {
    return { success: false, error: "Failed to process plan form." };
  }
}

// Transfer Form Action
export async function submitTransferForm(data: any) {
  try {
    const subject = `New Transfer Booking from ${data.name}`;
    const html = `
      <h2>New Transfer Booking Request</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Passengers:</strong> ${data.passengers}</p>
      <p><strong>Pickup Location:</strong> ${data.pickupLocation}</p>
      <p><strong>Drop-off Location:</strong> ${data.dropoffLocation}</p>
      <p><strong>Pickup Date:</strong> ${data.pickupDate}</p>
      <p><strong>Pickup Time:</strong> ${data.pickupTime}</p>
      <p><strong>Special Requests:</strong> ${data.requests}</p>
    `;
    return await sendEmail(subject, html);
  } catch (error) {
    return { success: false, error: "Failed to process transfer form." };
  }
}

// Contact Form Action
export async function submitContactForm(data: any) {
  try {
    const subject = `New Contact Message from ${data.name}: ${data.subject}`;
    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `;
    return await sendEmail(subject, html);
  } catch (error) {
    return { success: false, error: "Failed to process contact form." };
  }
}

// Tour Booking Action
export async function submitTourBooking(data: any) {
  try {
    const subject = `New Tour Booking for: ${data.tourTitle}`;
    const html = `
      <h2>New Tour Booking Request</h2>
      <p><strong>Tour:</strong> ${data.tourTitle}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Travel Date:</strong> ${data.date}</p>
      <p><strong>Passengers:</strong> ${data.passengers}</p>
      <p><strong>Special Requests:</strong> ${data.requests}</p>
    `;
    return await sendEmail(subject, html);
  } catch (error) {
    return { success: false, error: "Failed to process tour booking." };
  }
}
