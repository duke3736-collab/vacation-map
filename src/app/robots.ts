import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vacation-map.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/settings"], // 비공개할 경로가 있다면 여기에 추가
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
