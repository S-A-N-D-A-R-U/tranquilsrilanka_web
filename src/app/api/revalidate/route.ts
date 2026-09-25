import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS, type CacheTag } from "@/lib/api";

/**
 * On-demand cache refresh for the admin panel.
 *
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *   Body (optional): { "tags": ["tours", "offers"] }   // omit to refresh everything
 *
 * Valid tags: tours, activities, hero-slides, offers, posts
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "Revalidation is not configured" }, { status: 503 });
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!safeEqual(token, secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const requested: unknown[] = Array.isArray(body?.tags) ? body.tags : [...CACHE_TAGS];
  const tags = requested.filter((t): t is CacheTag => CACHE_TAGS.includes(t as CacheTag));

  if (tags.length === 0) {
    return Response.json({ error: `No valid tags. Use: ${CACHE_TAGS.join(", ")}` }, { status: 400 });
  }

  // Called by an external system, so expire immediately rather than stale-while-revalidate
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return Response.json({ revalidated: tags, now: Date.now() });
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
