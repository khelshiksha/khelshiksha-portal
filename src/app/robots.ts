import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/", "/search"],
      },
    ],
    /* AI crawlers are deliberately NOT blocked. For an organisation whose
       goal is to be recognised as the authority on experiential learning in
       Indian schools, being cited in AI answers is a benefit. */
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
    host: SITE.url,
  };
}
