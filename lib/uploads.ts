const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

export function isAllowedImageFile(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.has(file.type);
}

// Re-validated on the read path too, in case a blob stored before this
// allow-list existed has an unsafe content type (e.g. text/html) — never
// serve anything but a known-safe image MIME type.
export function safeImageContentType(contentType: unknown): string {
  return typeof contentType === "string" && ALLOWED_IMAGE_TYPES.has(contentType)
    ? contentType
    : "application/octet-stream";
}

// Strips the name down to a safe basename so it can't inject path
// separators (or traversal sequences) into a storage key built as
// `${prefix}-${file.name}`.
export function sanitizeFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() || "file";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "_");
  return cleaned.slice(-100) || "file";
}
