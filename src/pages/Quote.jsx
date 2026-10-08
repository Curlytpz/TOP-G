import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CarFront, Check, CheckCircle2, Clock3, Copy, House, MapPin, MessageCircle, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { ApiError, getMaterials, getServices, submitQuote } from "../lib/api";
import PageHeader from "../components/pageDesign/PageHeader";
import Reveal from "../components/motion/Reveal";
import TurnstileChallenge from "../components/TurnstileChallenge";
import useTheme from "../hooks/useTheme";

const installations = [
  { value: "SHOP", label: "TOP-G Shop" },
  { value: "HOME_SERVICE", label: "Home Service" },
  { value: "UNSURE", label: "Not Sure Yet" },
];
const unsureMaterial = { id: "UNSURE", name: "Not Sure Yet", type: "We can help you choose", warrantyYears: null };
const emptyForm = { fullName: "", phone: "", email: "", carModel: "", yearModel: "", services: [], material: "", installation: "", preferredDate: "", notes: "" };
const maxVehicleYear = new Date().getFullYear() + 1;
const quoteFieldMap = { customerName: "fullName", serviceIds: "services", materialId: "material", installationType: "installation" };

function errorFor(field, value) {
  const text = String(value || "").trim();

  if (["fullName", "carModel"].includes(field) && !text) return "This field is required.";
  if (field === "phone") {
    if (!text) return "Please enter your phone number.";
    if (!/^\+?\d{10,15}$/.test(text.replace(/[\s()-]/g, ""))) return "Enter a valid phone number with 10–15 digits.";
  }
  if (field === "email" && text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return "Enter a valid email address or leave this blank.";
  if (field === "yearModel") {
    if (!text) return "Please enter your vehicle's year model.";
    if (!Number.isInteger(Number(text)) || Number(text) < 1886 || Number(text) > maxVehicleYear) return `Enter a year from 1886 to ${maxVehicleYear}.`;
  }
  if (field === "services" && (!Array.isArray(value) || value.length === 0)) return "Please choose at least one service.";
  if (["material", "installation"].includes(field) && !text) return "Please choose an option.";
  return "";
}

function ErrorText({ id, text }) {
  return text ? <p id={id} className="tg-quote-error" role="alert">{text}</p> : null;
}

function quoteReferenceFromId(quoteId) {
  const suffix = String(quoteId || "").replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  return suffix ? "TG-" + suffix : "TG-REQUEST";
}

function Quote() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState("");
  const [isMessageCopied, setIsMessageCopied] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const { theme } = useTheme();
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
  const messengerUrl = (import.meta.env.VITE_MESSENGER_URL || "").trim();
  const quoteReference = quoteReferenceFromId(submittedQuoteId);
  const messengerMessage = "Hi TOP-G, I just submitted quote request " + quoteReference + " for my vehicle.";

  const loadCatalog = useCallback(async () => {
    setIsCatalogLoading(true);
    setCatalogError("");

    try {
      const [servicesResponse, materialsResponse] = await Promise.all([getServices(), getMaterials()]);
      setServices(Array.isArray(servicesResponse.data) ? servicesResponse.data : []);
      setMaterials(Array.isArray(materialsResponse.data) ? materialsResponse.data : []);
    } catch {
      setCatalogError("We couldn’t load service and material options. Please try again.");
    } finally {
      setIsCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadCatalog();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadCatalog]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setIsComplete(false);
    setSubmitError("");
    if (errors[field]) setErrors((current) => ({ ...current, [field]: errorFor(field, value) }));
  };

  const select = (field, value) => {
    update(field, value);
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const toggleService = (serviceId) => {
    setForm((current) => ({ ...current, services: current.services.includes(serviceId) ? current.services.filter((id) => id !== serviceId) : [...current.services, serviceId] }));
    setIsComplete(false);
    setSubmitError("");
    setErrors((current) => ({ ...current, services: "" }));
  };

  const validate = (field) => setErrors((current) => ({ ...current, [field]: errorFor(field, form[field]) }));

  const handleApiValidationError = (apiError) => {
    const fieldErrors = apiError.body?.details?.fieldErrors || {};
    const nextErrors = {};

    Object.entries(fieldErrors).forEach(([field, messages]) => {
      const uiField = quoteFieldMap[field] || field;
      if (uiField in emptyForm && messages?.[0]) nextErrors[uiField] = messages[0];
    });

    setErrors((current) => ({ ...current, ...nextErrors }));
    setSubmitError(apiError.body?.details?.formErrors?.[0] || "Please review the highlighted fields and try again.");
  };

  const handleTurnstileToken = useCallback((token) => {
    setTurnstileToken(token);
    if (token) setSubmitError("");
  }, []);

  const copyMessengerMessage = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(messengerMessage);
      } else {
        const copyField = document.createElement("textarea");
        copyField.value = messengerMessage;
        copyField.setAttribute("readonly", "");
        copyField.style.position = "fixed";
        copyField.style.opacity = "0";
        document.body.appendChild(copyField);
        copyField.select();
        document.execCommand("copy");
        copyField.remove();
      }
      setIsMessageCopied(true);
      window.setTimeout(() => setIsMessageCopied(false), 1800);
    } catch {
      setSubmitError("We couldn't copy the message. Please select and copy it manually.");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!turnstileToken) {
      setSubmitError("Please complete the security verification before submitting your request.");
      return;
    }

    const nextErrors = Object.fromEntries(Object.entries(form).map(([field, value]) => [field, errorFor(field, value)]));
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      const submittedForm = event.currentTarget;
      window.requestAnimationFrame(() => submittedForm.querySelector('[aria-invalid="true"], [data-invalid="true"] button')?.focus());
      return;
    }

    if (isCatalogLoading || catalogError) {
      setSubmitError("Service and material options need to load before you can submit your request.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setIsComplete(false);

    const payload = {
      customerName: form.fullName.trim(),
      phone: form.phone.trim(),
      carModel: form.carModel.trim(),
      yearModel: Number(form.yearModel),
      serviceIds: form.services,
      turnstileToken,
      installationType: form.installation,
    };

    if (form.email.trim()) payload.email = form.email.trim();
    if (form.material && form.material !== unsureMaterial.id) payload.materialId = form.material;
    if (form.preferredDate) payload.preferredDate = form.preferredDate;
    if (form.notes.trim()) payload.notes = form.notes.trim();

    try {
      const response = await submitQuote(payload);
      setSubmittedQuoteId(response?.data?.id || "");
      setForm(emptyForm);
      setErrors({});
      setIsComplete(true);
      setTurnstileToken("");
      setTurnstileResetKey((current) => current + 1);
    } catch (error) {
      if (error instanceof ApiError && error.status === 422 && error.body?.error !== "TURNSTILE_FAILED") {
        handleApiValidationError(error);
      } else {
        setTurnstileToken("");
        setTurnstileResetKey((current) => current + 1);
        setSubmitError(error instanceof ApiError && error.body?.error === "TURNSTILE_FAILED" ? "Security verification failed or expired. Please complete it again." : "We couldn’t submit your quote request right now. Please check your connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const textField = (field, label, { wide, optional, ...inputProps } = {}) => <label className={`tg-quote-field ${wide ? "tg-quote-field--wide" : ""}`}><span>{label} {optional ? <em>Optional</em> : <b aria-hidden="true">*</b>}</span><input name={field} value={form[field]} onChange={(event) => update(field, event.target.value)} onBlur={() => validate(field)} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `${field}-error` : undefined} {...inputProps} /><ErrorText id={`${field}-error`} text={errors[field]} /></label>;
  const sectionHeading = (number, id, title, detail) => <div className="tg-quote-section-heading"><span>{number}</span><div><h2 id={id}>{title}</h2><p>{detail}</p></div></div>;
  const cardClass = (field, value, extra = "") => {
    const selected = field === "services" ? form.services.includes(value) : form[field] === value;
    return `tg-quote-option ${extra} ${selected ? "is-selected" : ""}`;
  };
  const catalogMessage = isCatalogLoading ? "Loading options…" : catalogError;

  return <main className="tg-page tg-surface tg-quote">
    <PageHeader label="Get a quote" pageName="Get a Quote" title="Shape your ideal interior." description="Tell us what you drive and the finish you have in mind. We’ll use these details to prepare your quotation." />
    <section className="tg-page-content"><div className="tg-page-container tg-quote-layout">
      <Reveal as="form" className="tg-quote-form" onSubmit={submit} noValidate>
        <div className="tg-quote-form-intro"><span className="tg-quote-form-intro__icon"><Sparkles size={18} aria-hidden="true" /></span><div><p className="tg-quote-kicker">Your project details</p><p>Fields marked <span aria-hidden="true">*</span> are required.</p></div></div>
        {catalogError && <div className="tg-quote-catalog-error" role="alert"><span>{catalogError}</span><button type="button" onClick={loadCatalog}>Retry</button></div>}
        <section className="tg-quote-section" aria-labelledby="customer-details">{sectionHeading("01", "customer-details", "Customer details", "How we can reach you about your project.")}<div className="tg-quote-field-grid">{textField("fullName", "Full name", { autoComplete: "name", placeholder: "Your full name" })}{textField("phone", "Phone number", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "e.g. 0930 367 9533" })}{textField("email", "Email address", { type: "email", autoComplete: "email", placeholder: "you@example.com", optional: true, wide: true })}</div></section>
        <section className="tg-quote-section" aria-labelledby="vehicle-details">{sectionHeading("02", "vehicle-details", "Vehicle details", "A few basics help us understand your fitment needs.")}<div className="tg-quote-field-grid">{textField("carModel", "Car model", { placeholder: "e.g. Toyota Vios" })}{textField("yearModel", "Year model", { type: "number", inputMode: "numeric", min: "1886", max: maxVehicleYear, placeholder: "e.g. 2020" })}</div></section>
        <fieldset className="tg-quote-section tg-quote-fieldset" aria-describedby={errors.services ? "services-error" : undefined} data-invalid={Boolean(errors.services)} aria-busy={isCatalogLoading}><legend className="tg-quote-section-heading"><span>03</span><span><strong>Services</strong><small>Choose one or more services you’re considering. <b aria-hidden="true">*</b></small></span></legend><div className="tg-quote-selection-grid tg-quote-selection-grid--service">{isCatalogLoading || catalogError ? <p className="tg-quote-catalog-state">{catalogMessage}</p> : services.map((service) => <button key={service.id} type="button" className={cardClass("services", service.id)} onClick={() => toggleService(service.id)} aria-pressed={form.services.includes(service.id)}><Wrench size={18} aria-hidden="true" /><span><strong>{service.name}</strong><small>{service.description || "Custom TOP-G Auto Seat service"}</small></span><CheckCircle2 className="tg-quote-option__check" size={18} aria-hidden="true" /></button>)}</div><ErrorText id="services-error" text={errors.services} /></fieldset>
        <fieldset className="tg-quote-section tg-quote-fieldset" aria-describedby={errors.material ? "material-error" : undefined} data-invalid={Boolean(errors.material)} aria-busy={isCatalogLoading}><legend className="tg-quote-section-heading"><span>04</span><span><strong>Material</strong><small>Choose a material line, or we’ll guide you. <b aria-hidden="true">*</b></small></span></legend><div className="tg-quote-selection-grid tg-quote-selection-grid--material">{isCatalogLoading || catalogError ? <p className="tg-quote-catalog-state">{catalogMessage}</p> : [...materials, unsureMaterial].map((material) => <button key={material.id} type="button" className={cardClass("material", material.id, "tg-quote-material-option")} onClick={() => select("material", material.id)} aria-pressed={form.material === material.id}><span><strong>{material.name}</strong><small>{material.type}</small><em>{material.warrantyYears ? `${material.warrantyYears}-Year Warranty` : "Material consultation"}</em></span><CheckCircle2 className="tg-quote-option__check" size={18} aria-hidden="true" /></button>)}</div><ErrorText id="material-error" text={errors.material} /></fieldset>
        <fieldset className="tg-quote-section tg-quote-fieldset" aria-describedby={errors.installation ? "installation-error" : undefined} data-invalid={Boolean(errors.installation)}><legend className="tg-quote-section-heading"><span>05</span><span><strong>Installation</strong><small>Walk-ins and appointments are accepted; most installations are scheduled. <b aria-hidden="true">*</b></small></span></legend><div className="tg-quote-selection-grid tg-quote-selection-grid--installation">{installations.map((installation) => <button key={installation.value} type="button" className={cardClass("installation", installation.value, "tg-quote-installation-option")} onClick={() => select("installation", installation.value)} aria-pressed={form.installation === installation.value}><House size={18} aria-hidden="true" /><strong>{installation.label}</strong><CheckCircle2 className="tg-quote-option__check" size={18} aria-hidden="true" /></button>)}</div><ErrorText id="installation-error" text={errors.installation} /></fieldset>
        <section className="tg-quote-section" aria-labelledby="schedule-notes">{sectionHeading("06", "schedule-notes", "Preferred schedule & notes", "Optional details that help us start the conversation.")}<label className="tg-quote-field"><span>Preferred schedule <em>Optional</em></span><input name="preferredDate" type="date" value={form.preferredDate} onChange={(event) => update("preferredDate", event.target.value)} /><small className="tg-quote-help"><CalendarDays size={15} aria-hidden="true" /> This is only a preferred schedule and is not automatically confirmed.</small></label><label className="tg-quote-field tg-quote-field--notes"><span>Additional notes <em>Optional</em></span><textarea name="notes" value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Tell us your preferred color, design, or other requests." /></label></section>
        {submitError && <div className="tg-quote-submit-error" role="alert">{submitError}</div>}
        {isComplete && <div className="tg-quote-success" role="status"><CheckCircle2 size={21} aria-hidden="true" /><div><strong>Your quote request has been submitted successfully.</strong><p>TOP-G Auto Seat will contact you after reviewing your vehicle details.</p></div></div>}
        <TurnstileChallenge siteKey={turnstileSiteKey} theme={theme} resetKey={turnstileResetKey} onTokenChange={handleTurnstileToken} />
        <p className="tg-quote-privacy-notice">By submitting this form, you acknowledge that TOP-G Auto Seat will use the information you provide to review your request, prepare a quotation, and contact you regarding your inquiry. Your preferred schedule is not automatically confirmed. <Link to="/privacy">Privacy Notice</Link><span aria-hidden="true"> · </span><Link to="/terms">Terms &amp; Conditions</Link></p>
        <button className="tg-quote-submit" type="submit" disabled={isSubmitting || isCatalogLoading || Boolean(catalogError) || !turnstileToken}>{isSubmitting ? "Submitting..." : "Request a quote"}</button>
      </Reveal>
      <Reveal as="aside" delay={100} className="tg-quote-sidebar"><div className="tg-quote-sidebar__lead"><CarFront size={23} aria-hidden="true" /><p className="tg-quote-kicker">Plan your visit</p><h2>Made for your schedule.</h2><p>Walk in or reserve a time—our team is ready to help plan your installation.</p></div><dl className="tg-quote-info-list"><div><Clock3 size={18} aria-hidden="true" /><dt>Operating hours</dt><dd>8:00 AM – 5:00 PM</dd></div><div><MapPin size={18} aria-hidden="true" /><dt>Location</dt><dd>Sitio Visitas, Sta. Maria, Mexico, Pampanga</dd></div><div><CalendarDays size={18} aria-hidden="true" /><dt>Visit options</dt><dd>Walk-ins & scheduled appointments accepted</dd></div><div><House size={18} aria-hidden="true" /><dt>Installation</dt><dd>Home service available</dd></div></dl><div className="tg-quote-sidebar__note"><ShieldCheck size={18} aria-hidden="true" /><p>Most installations are scheduled so we can prepare the right materials and fit for your vehicle.</p></div></Reveal>
    </div></section>
  </main>;
}

export default Quote;
