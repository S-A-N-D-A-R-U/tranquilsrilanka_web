import "server-only";
import sanitizeHtml from "sanitize-html";

/** Allow-list sanitizer for CMS/blog HTML rendered with dangerouslySetInnerHTML. */
export function sanitizeRichText(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "figure", "figcaption", "iframe"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel", "title"],
      img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
      iframe: ["src", "width", "height", "title", "allow", "allowfullscreen", "frameborder"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // Only embeds from trusted video/map hosts
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com", "www.google.com"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
