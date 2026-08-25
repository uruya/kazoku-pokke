export function requiredText(
  formData: FormData,
  key: string,
  maxLength = 120,
): string {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("必須項目を入力してください。");
  }
  return value.trim().slice(0, maxLength);
}

export function optionalText(
  formData: FormData,
  key: string,
  maxLength = 500,
): string | null {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }
  return value.trim().slice(0, maxLength);
}
