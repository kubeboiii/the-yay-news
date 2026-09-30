import type { MetadataRoute } from "next";

/** Lets the paper sit on a home screen and open like an app, straight to today's front page. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Yay News",
    short_name: "Yay News",
    description: "A daily newspaper of only good news. New every morning at 7, and then it ends.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#efe8d8",
    theme_color: "#161412",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
