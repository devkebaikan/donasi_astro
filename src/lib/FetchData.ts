const baseUrl = import.meta.env.ASTRO_API_URL;

export async function getCampaignRamadhan() {
  try {
    const res = await fetch(`${baseUrl}/program-show/ramadhan`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch ramadhan campaign");

    return await res.json();
  } catch (error) {
    console.error("Error fetching ramadhan campaign:", error);
    return null;
  }
}

// get campaign show
export async function getCampaignShow(type: string) {
  try {
    const res = await fetch(`${baseUrl}/program-show/${type}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch show campaign");

    return await res.json();
  } catch (error) {
    console.error("Error fetching show campaign:", error);
    return null;
  }
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
      `${baseUrl}/program/link/${link}/donors?limit=10&mode=pagination&page=1`,

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
      `${baseUrl}/program/link/${link}/fundraisers?limit=6&mode=pagination&page=1`,
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

// get report by link
export async function getAllReportByLink(link: string | null) {
  try {
    const res = await fetch(`${baseUrl}/report?program_link=${link}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch report for link: ${link}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching report with link ${link}:`, error);
    return null;
  }
}

// get project by link
export async function getProjectByLink(link: string | null) {
  try {
    const res = await fetch(`${baseUrl}/project?program_link=${link}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch project summary for link: ${link}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching project summary with link ${link}:`, error);
    return null;
  }
}

// get project summary by link
export async function getProjectSummaryByLink(link: string | null) {
  try {
    const res = await fetch(`${baseUrl}/project/summary?program_link=${link}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch project summary for link: ${link}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching project summary with link ${link}:`, error);
    return null;
  }
}

// get project mitra salur by link
export async function getMitraSalurByLink(link: string | null) {
  try {
    const res = await fetch(
      `${baseUrl}/program/mitra-salur?program_link=${link}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch mitra project for link: ${link}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching mitra project with link ${link}:`, error);
    return null;
  }
}

// get all donors
export async function getAllDonors() {
  try {
    const res = await fetch(`/program/link/${baseUrl}/donors`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch all donors");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching all donors:", error);
    return null;
  }
}

// get all campaign category
export async function getCampaignCategories() {
  try {
    const res = await fetch(`${baseUrl}/program-category`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch campaign categories");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching campaign categories:", error);
    return null;
  }
}

export interface CampaignParams {
  limit?: number;
  mode?: string;
  page?: number;
  category?: string | null;
  search?: string | null;
}

// get all campaign
export async function getAllCampaigns(params: CampaignParams = {}) {
  try {
    const query = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== null && v !== undefined && v !== "") {
        query.set(k, String(v));
      }
    }

    const res = await fetch(`${baseUrl}/program?${query}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch programs");

    return await res.json();
  } catch (error) {
    console.error("Error fetching programs:", error);
    return null;
  }
}

// validate token (throws if invalid — gunakan di middleware)
export async function getIsTokenValid(token: string): Promise<boolean> {
  const res = await fetch(`${baseUrl}/validate-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Invalid token");
  return true;
}

// get authenticated user profile
export async function getUserProfile(token: string) {
  try {
    const res = await fetch(`${baseUrl}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Unauthorized");
    return await res.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// get detail rutin by link
export async function getRutinDetail(
  slug: number | string,
  token: string | null,
) {
  try {
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${baseUrl}/rutin/detail/${slug}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok)
      throw new Error(`Failed to fetch rutin detail for slug: ${slug}`);

    return await res.json();
  } catch (error) {
    console.error("Error fetching rutin detail:", error);
    return null;
  }
}

// get program setup by type
export async function getCampaignSetUp(type: string) {
  try {
    const res = await fetch(`${baseUrl}/program-setup/${type}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch campaign setup");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching campaign setup:", error);
    return null;
  }
}
