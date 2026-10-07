export const quoteStatuses = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const statusLabels = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUOTED: "Quoted",
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusClasses = {
  NEW: "border-blue-400/25 bg-blue-400/10 text-blue-300",
  CONTACTED: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  QUOTED: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  SCHEDULED: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
  IN_PROGRESS: "border-orange-400/25 bg-orange-400/10 text-orange-300",
  COMPLETED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  CANCELLED: "border-zinc-400/25 bg-zinc-400/10 text-zinc-300",
};

const installationLabels = {
  SHOP: "TOP-G Shop",
  HOME_SERVICE: "Home Service",
  UNSURE: "Not Sure Yet",
};

export function getStatusLabel(status) {
  return statusLabels[status] || "Unknown";
}

export function getStatusClassName(status) {
  return statusClasses[status] || statusClasses.CANCELLED;
}

export function getInstallationLabel(type) {
  return installationLabels[type] || "Not specified";
}

export function formatDate(value, options = {}) {
  if (!value) return "Not specified";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not specified";

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    ...options,
  }).format(date);
}

export function formatSubmittedDate(value) {
  return formatDate(value, {
    timeStyle: "short",
  });
}

export function getQuoteServiceNames(quote) {
  const services = Array.isArray(quote?.services) ? quote.services : [];
  const names = services.map((service) => service?.name).filter(Boolean);
  if (names.length) return names;
  return quote?.service?.name ? [quote.service.name] : [];
}