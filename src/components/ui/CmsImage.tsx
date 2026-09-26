import Image, { type ImageProps } from "next/image";

// Hosts allowed in next.config.ts images.remotePatterns
const OPTIMIZED_REMOTE_HOSTS = ["res.cloudinary.com"];

function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZED_REMOTE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

/**
 * next/image for URLs that come from the database. Local and Cloudinary images are
 * optimized; any other host (e.g. a URL pasted into the admin) is served as-is
 * instead of failing because it isn't in images.remotePatterns.
 */
export default function CmsImage({ src, alt, ...props }: Omit<ImageProps, "src"> & { src?: string | null }) {
  // next/image throws on an empty src; a record without an image just renders nothing
  if (!src) return null;
  return <Image src={src} alt={alt} unoptimized={!canOptimize(src)} {...props} />;
}
