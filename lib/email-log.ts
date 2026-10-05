// The Resend SDK resolves with { error } on rejection (bad domain, bad key,
// quota) instead of throwing, so a try/catch alone never sees those failures.
export function logEmailResult(label: string, result: { error: { message: string } | null }): void {
  if (result.error) {
    console.error(`Failed to send ${label}:`, result.error);
  }
}
