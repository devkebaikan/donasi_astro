export async function fetchGtm() {
  try {
    if (cachedGtm) return cachedGtm;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/gtm/ids`,
      {
        params: {
          web: "aksiberbagi.com",
        },
      },
    );
    cachedGtm = response.data.data || null;
    return cachedGtm;
    // setGtmIds(response.data.data || []);
  } catch (error) {
    console.error("Error fetching GTM IDs:", error);
  }
}
