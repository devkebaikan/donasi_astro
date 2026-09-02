declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    fbq: any;
  }
}

/**
 * Push event ke GTM (GA4 format)
 */
export function pushGTMEvent(event: string, value?: any) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event,
    ...(value && value),
  });
}

/**
 * Track Meta Pixel
 */
export function trackMeta(event: string, payload: any) {
  if (typeof window === "undefined") return;

  if (window.fbq) {
    window.fbq("track", event, payload);
  }
}

/**
 * Track Begin Checkout (Donasi)
 */
export function trackBeginCheckout({
  programId,
  value,
}: {
  programId: string;
  value: number;
}) {
  pushGTMEvent("InitiateCheckout", {
    currency: "IDR",
    value,
    item_id: programId,
  });

  // Meta
  trackMeta("InitiateCheckout", {
    value,
    currency: "IDR",
    item_id: programId,
    content_type: "product",
  });
}

/**
 * Track Purchase
 */

export function trackPurchase({
  invoice,
  value,
}: {
  invoice: string;
  value: number | string;
}) {
  const normalizedValue = Number(value);

  // console.log("Purchase Value Raw:", value);
  // console.log("Purchase Value Parsed:", normalizedValue);

  if (!normalizedValue || isNaN(normalizedValue)) {
    console.error("Invalid purchase value", value);
    return;
  }

  // GA4 / GTM
  pushGTMEvent("purchase", {
    currency: "IDR",
    value: normalizedValue,
    transaction_id: invoice,
  });

  // Meta Pixel
  trackMeta("purchase", {
    value: normalizedValue,
    currency: "IDR",
    transaction_id: invoice,
  });
}
