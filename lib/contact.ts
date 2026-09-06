const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validContactEmail(value: string | undefined) {
  const email = value?.trim();
  return email && email.length <= 254 && EMAIL_PATTERN.test(email)
    ? email
    : null;
}
