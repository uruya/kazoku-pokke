import { timingSafeEqual } from "node:crypto";

export function isValidCronAuthorization(
  authorization: string | null,
  secret: string | undefined,
) {
  if (!authorization || !secret) return false;
  const expected = `Bearer ${secret}`;
  const actualBuffer = Buffer.from(authorization);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}
