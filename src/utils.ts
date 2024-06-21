import { createHmac, timingSafeEqual } from "crypto";

export const BLUECANVAS_AWS_ACCOUNTS = [
  "801025944130",
  "355879424334",
  "960227768167",
];

export function verifyHMac(
  webhookSecret: string,
  requestBody: Buffer | string,
  requestSignatureFromHeader: string
): boolean {
  const hmac = createHmac("sha256", webhookSecret).update(requestBody);
  const digest = hmac.digest();
  const expectedDigest = Buffer.from(requestSignatureFromHeader, "base64");
  if (digest.length !== expectedDigest.length) {
    return false;
  }

  return timingSafeEqual(digest, expectedDigest);
}
