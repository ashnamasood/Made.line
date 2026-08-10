/**
 * Sends via Resend's REST API — no SDK, since this is the only call we make.
 * Silently no-ops when unconfigured so orders still save; the caller logs.
 */
export async function sendAdminEmail(subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  const from = process.env.FROM_EMAIL;
  if (!key || !to || !from) return { sent: false, reason: "not configured" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });

  if (!res.ok) {
    return { sent: false, reason: `resend ${res.status}: ${await res.text()}` };
  }
  return { sent: true };
}
