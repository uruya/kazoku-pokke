export function safeRedirectPath(
  value: FormDataEntryValue | string | null | undefined,
  fallback = "/",
) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /%(?:2f|5c|0d|0a)/i.test(value)
  ) {
    return fallback;
  }

  return value;
}
