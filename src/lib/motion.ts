/** Preload a list of image URLs in the background. */
export const preloadImages = (urls: string[]) => {
  if (typeof window === "undefined") return;
  const preload = () => {
    urls.forEach((u) => {
      const i = new Image();
      i.decoding = "async";
      i.src = u;
    });
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preload, { timeout: 1800 });
  } else {
    globalThis.setTimeout(preload, 400);
  }
};