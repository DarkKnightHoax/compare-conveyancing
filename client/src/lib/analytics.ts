/**
 * Analytics helper — fires GA4 events and Google Ads conversion events.
 *
 * GA4 tag (G-L5F4BZBH87) is loaded in index.html.
 * All events are also fired as "ads_conversion_SUBMIT_LEAD_FORM_1" for
 * Google Ads campaign optimisation (to be linked as a conversion goal in GA4 → Google Ads).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

/**
 * Event 1: Contact Us form successfully submitted.
 * Fire when the user submits the contact form and the server confirms receipt.
 */
export function trackContactFormSubmit(params?: {
  subject?: string;
}) {
  // Standard GA4 event
  gtag("event", "contact_form_submit", {
    event_category: "lead",
    event_label: params?.subject ?? "contact_enquiry",
  });

  // Google Ads conversion event — matches the campaign conversion goal
  gtag("event", "ads_conversion_SUBMIT_LEAD_FORM_1", {
    event_category: "lead",
    event_label: "contact_form",
  });
}

/**
 * Event 2: User clicks "Email Me This Quote" on the results page.
 * Fire when the user opens the email quote modal (intent to receive quote).
 */
export function trackEmailQuoteRequest(params?: {
  firmName?: string;
}) {
  // Standard GA4 event
  gtag("event", "email_quote_request", {
    event_category: "lead",
    event_label: params?.firmName ?? "email_quote",
  });

  // Google Ads conversion event
  gtag("event", "ads_conversion_SUBMIT_LEAD_FORM_1", {
    event_category: "lead",
    event_label: "email_quote",
  });
}

/**
 * Event 3: User clicks "Instruct Directly" on the results page.
 * Fire when the user opens the instruct modal (highest-intent action).
 */
export function trackInstructDirectly(params?: {
  firmName?: string;
}) {
  // Standard GA4 event
  gtag("event", "instruct_directly", {
    event_category: "lead",
    event_label: params?.firmName ?? "instruct",
  });

  // Google Ads conversion event
  gtag("event", "ads_conversion_SUBMIT_LEAD_FORM_1", {
    event_category: "lead",
    event_label: "instruct_directly",
  });
}
