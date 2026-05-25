import type { MetadataRoute } from "next";
import config from "@/config";

export default function robots(): MetadataRoute.Robots {
  if (!config.isMobileApp) {
    // Allow all bots when it's a mobile app
    return {
      rules: {
        userAgent: "*",
        allow: "/",
      }
    };
  } else {
    // Disallow all bots when it's not a mobile app
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      }
    };
  }
}
