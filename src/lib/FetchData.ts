const baseUrl = import.meta.env.ASTRO_API_URL;

// get campaign for ramadhan
// categiry ramadhan 13
export async function getCampaignRamadhan() {
  const res = await fetch(`${baseUrl}/program-show/ramadhan`, {
    headers: {
      Accept: "application/json",
    },
  });

  //   const res = await fetch(`${baseUrl}/program?category=6&limit=5`, {
  //   headers: {
  //     Accept: "application/json",
  //   },
  // });

  if (!res.ok) {
    throw new Error("Failed to fetch campaign data");
  }

  const data = await res.json();
  return data;
}

// get campaign by link
export async function getCampaignByLink(link: string) {
  const res = await fetch(`${baseUrl}/program/link/${link}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch campaign data by ID");
  }

  const data = await res.json();
  return data;
}

//  get Report by Link
export async function getReportByLink(link: string) {
  try {
    const res = await fetch(`${baseUrl}/report?program_link=${link}&limit=1`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch report data for link: ${link}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching report with link ${link}:`, error);
    return null;
  }
}

// get Donor by link
export async function getDonorsByLink(link: string) {
  try {
    const res = await fetch(
      `${baseUrl}/program/link/${link}/donors?limit=5&mode=pagination&page=1`,

      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch donor data for link: ${link}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching donor with link ${link}:`, error);
    return null;
  }
}

// get fundraiser by link
export async function getFundraisersByLink(link: string) {
  try {
    const res = await fetch(
      `${baseUrl}/program/link/${link}/fundraisers?limit=3&mode=pagination&page=1`,
      {
        headers: {
          Accept: "application/json",
          // Efficient API caching
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch fundraiser data for link: ${link}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching fundraiser with link ${link}:`, error);
    return null;
  }
}

// get nominal option by link
export async function getNominalOptions(link: string) {
  try {
    const res = await fetch(
      `${baseUrl}/payment/nominal-option?program_link=${link}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch program data for ID: ${link}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching program with Link ${link}:`, error);
    return null;
  }
}

// get payment method by link
export async function getPaymentMethod(link: string) {
  try {
    const response = await fetch(
      `${baseUrl}/payment/payment-method?program_link=${link}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    return await response.json();
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return null;
  }
}

// get invoice donation
export async function getInvoice(inv: string | null) {
  try {
    const res = await fetch(`${baseUrl}/transactions/invoice/${inv}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch invoice data for inv: ${inv}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching invoice with inv ${inv}:`, error);
    return null;
  }
}
