import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "inItaly",
    short_name: "inItaly",
    description: "A Progressive Web App built for inItaly",
    start_url: "/",
    launch_handler: {
      client_mode: ["focus-existing", "auto"],
    },
    dir: "ltr",
    lang: "it",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-48x48.png",
        type: "image/png",
        sizes: "48x48",
      },
      {
        src: "/icon-96x96.png",
        type: "image/png",
        sizes: "96x96",
        purpose: "any",
      },
      {
        src: "/icon-144x144.png",
        type: "image/png",
        sizes: "144x144",
      },
      {
        src: "/icon-192x192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "maskable",
      },
      {
        src: "/icon-256x256.png",
        type: "image/png",
        sizes: "256x256",
      },
      {
        src: "/icon-384x384.png",
        type: "image/png",
        sizes: "384x384",
      },
      {
        src: "/icon-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
  };
}
