const productionUrl = "https://kazoku-pokke.jp";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!configuredUrl) {
    return process.env.NODE_ENV === "production"
      ? productionUrl
      : "http://localhost:3000";
  }

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return process.env.NODE_ENV === "production"
      ? productionUrl
      : "http://localhost:3000";
  }
}
