export const SITE_URL = "https://www.tranquilsrilanka.com";
export const SITE_NAME = "Tranquil Sri Lanka";

/** Strip HTML tags and collapse whitespace. */
export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Trim text to `max` chars on a word boundary, for meta descriptions. */
export function truncate(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:—-]+$/, "")}…`;
}

/** Serialize JSON-LD safely for a <script> tag (prevents `</script>` breakout). */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
