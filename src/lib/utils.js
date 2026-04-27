export function cleanUpdatedData(data) {
  const cleanedData = {};

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      // Keep the array only if it contains at least one value
      if (value.length > 0) {
        cleanedData[key] = value;
      }
    } else if (value !== null && value !== "") {
      // Keep the value if it's not null or blank
      cleanedData[key] = value;
    }
  }

  return cleanedData;
}

export const getFbTrackingIds = () => {
  const fbc = document.cookie
    .split("; ")
    .find((row) => row.startsWith("_fbc="))
    ?.split("=")[1];

  const fbp = document.cookie
    .split("; ")
    .find((row) => row.startsWith("_fbp="))
    ?.split("=")[1];

  const gclid = document.cookie
    .split("; ")
    .find((row) => row.startsWith("_gclid="))
    ?.split("=")[1];

  return { fbc, fbp, gclid };
};
