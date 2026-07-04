// ADMIN_PASSWORD_HASH is stored base64-encoded because Netlify's env var
// system expands `$VARNAME` references inside values — a raw bcrypt hash
// (e.g. `$2b$10$...`) gets silently mangled since it looks like `$2b`,
// `$10`, etc. referencing (nonexistent) other variables. Base64 avoids `$`
// entirely, so it round-trips safely both locally and on Netlify.
export function getAdminPasswordHash(): string | undefined {
  const encoded = process.env.ADMIN_PASSWORD_HASH;
  if (!encoded) return undefined;
  return Buffer.from(encoded, "base64").toString("utf8");
}
