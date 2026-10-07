import { Resend } from "resend";
import { config } from "../config/env.js";

let disabledNoticeLogged = false;

function html(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function inline(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function formatDate(value) {
  if (!value) return "Not provided";
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(value));
}

function installationLabel(value) {
  return ({ SHOP: "TOP-G Shop", HOME_SERVICE: "Home Service", UNSURE: "Not Sure Yet" })[value] || "Not Sure Yet";
}

function notificationsConfigured() {
  return Boolean(config.resendApiKey && config.quoteNotificationEmail && config.emailFrom);
}

function getResend() {
  if (notificationsConfigured()) return new Resend(config.resendApiKey);
  if (!disabledNoticeLogged) {
    console.info("[email] Quote email notifications are disabled: RESEND_API_KEY, QUOTE_NOTIFICATION_EMAIL, and EMAIL_FROM must be configured.");
    disabledNoticeLogged = true;
  }
  return null;
}

async function send(message) {
  const resend = getResend();
  if (!resend) return { skipped: true };

  try {
    const result = await resend.emails.send(message);
    if (result.error) throw new Error(result.error.message || "Email provider request failed.");
    return result.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Email provider request failed.");
  }
}

function serviceLabel(quote) {
  const services = Array.isArray(quote.services) ? quote.services : [];
  return services.length ? services.map((service) => service.name).join(", ") : (quote.service?.name || "Not selected");
}

function detailRows(quote) {
  return [
    ["Customer", quote.customerName],
    ["Phone", quote.phone],
    ["Email", quote.email || "Not provided"],
    ["Vehicle", `${quote.carModel} ${quote.yearModel}`],
    ["Services", serviceLabel(quote)],
    ["Material", quote.material?.name || "Not selected"],
    ["Installation", installationLabel(quote.installationType)],
    ["Preferred schedule", formatDate(quote.preferredDate)],
    ["Notes", quote.notes || "None"],
    ["Submitted", formatDate(quote.createdAt)],
    ["Quote ID", quote.id],
  ];
}

function detailsText(quote) {
  return detailRows(quote).map(([label, value]) => `${label}: ${inline(value)}`).join("\n");
}

function detailsHtml(quote) {
  return detailRows(quote).map(([label, value]) => `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-weight:700;vertical-align:top;white-space:nowrap;">${html(label)}</td><td style="padding:6px 0;color:#111827;">${html(value)}</td></tr>`).join("");
}

export async function sendNewQuoteNotification(quote) {
  const adminUrl = `${config.appUrl.replace(/\/$/, "")}/admin/quotes/${encodeURIComponent(quote.id)}`;
  const subject = `New TOP-G Quote Request — ${inline(quote.carModel)} ${quote.yearModel}`;
  return send({
    from: config.emailFrom,
    to: config.quoteNotificationEmail,
    subject,
    text: `A new TOP-G Auto Seat quote request was received.\n\n${detailsText(quote)}\n\nView in admin: ${adminUrl}`,
    html: `<main style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827;"><h1 style="margin:0 0 16px;font-size:22px;">New TOP-G Quote Request</h1><table style="border-collapse:collapse;width:100%;">${detailsHtml(quote)}</table><p style="margin:24px 0 0;"><a href="${html(adminUrl)}" style="color:#e31b23;font-weight:700;">View quote in admin</a></p></main>`,
  });
}

export async function sendCustomerQuoteConfirmation(quote) {
  if (!quote.email) return { skipped: true };
  const customerName = inline(quote.customerName);
  return send({
    from: config.emailFrom,
    to: quote.email,
    subject: "TOP-G Auto Seat — Quote Request Received",
    text: `Hi ${customerName},\n\nWe received your TOP-G Auto Seat quote request for your ${inline(quote.carModel)} ${quote.yearModel}. Our team will review your vehicle details and contact you after review.\n\nAny requested schedule is preferred only and is not yet confirmed.\n\nThank you,\nTOP-G Auto Seat`,
    html: `<main style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827;"><h1 style="margin:0 0 16px;font-size:22px;">Quote Request Received</h1><p>Hi ${html(customerName)},</p><p>We received your TOP-G Auto Seat quote request for your ${html(quote.carModel)} ${html(quote.yearModel)}. Our team will review your vehicle details and contact you after review.</p><p><strong>Your requested schedule is preferred only and is not yet confirmed.</strong></p><p>Thank you,<br>TOP-G Auto Seat</p></main>`,
  });
}

export async function notifyNewQuote(quote) {
  const tasks = [sendNewQuoteNotification(quote)];
  if (quote.email) tasks.push(sendCustomerQuoteConfirmation(quote));
  const results = await Promise.allSettled(tasks);
  results.forEach((result) => {
    if (result.status === "rejected") console.error("[email] quote notification failed", { quoteId: quote.id, reason: "provider request failed" });
  });
}