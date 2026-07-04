export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

export async function createSessionToken(): Promise<string> {
  const issuedAt = Date.now().toString();
  const key = await getKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(issuedAt),
  );
  return `${issuedAt}.${toHex(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;

  const [issuedAt, signatureHex] = token.split(".");
  if (!issuedAt || !signatureHex) return false;

  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > SESSION_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  const key = await getKey();
  const expectedSignature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(issuedAt),
  );
  const expectedHex = toHex(expectedSignature);

  if (expectedHex.length !== signatureHex.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    mismatch |= expectedHex.charCodeAt(i) ^ signatureHex.charCodeAt(i);
  }
  return mismatch === 0;
}
