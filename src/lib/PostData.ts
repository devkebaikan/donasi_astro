// initiate checkout
export async function postInitiateCheckout(data: any) {
  try {
    const res = await fetch(
      `https://admin.aksiberbagi.com/api/track/InitiateCheckout`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to POST invoice: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error posting invoice:", error);
    return null;
  }
}
