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

  // console.log(`GTM Event: ${event}`, value);
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
  programId,
  programName,
  value,
}: {
  invoice: string;
  programId: string;
  programName: string;
  value: number;
}) {
  pushGTMEvent("purchase", {
    transaction_id: invoice,
    currency: "IDR",
    value,
    items: [
      {
        item_id: programId,
        item_name: programName,
        price: value,
        quantity: 1,
      },
    ],
  });

  trackMeta("Purchase", {
    value,
    currency: "IDR",
    contents: [
      {
        id: programId,
        quantity: 1,
        item_price: value,
      },
    ],
    content_type: "product",
  });
}
