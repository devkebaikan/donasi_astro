import { postInitiateCheckout } from "./PostData";
import { getFbTrackingIds } from "./utils";

export const sendInitialCheckoutEvent = async (invoice, nominal) => {
  const { fbc, fbp, gclid } = getFbTrackingIds();

  const payload = {
    custom_data: {
      value: nominal,
      order_id: invoice,
      currency: "IDR",
    },
    event_source_url: window.location.href,
    fbc: fbc || null,
    fbp: fbp || null,
    gclid: gclid || null,
  };

  try {
    await postInitiateCheckout(payload);
  } catch (error) {
    console.error("Error :", error);
  }

  if (typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", {
      value: nominal,
      currency: "IDR",
      order_id: invoice,
    });
  }
};
