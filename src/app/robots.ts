import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vacation.weknews.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/settings"],
      },
      {
        userAgent: "Yeti", // 네이버 서치어드바이저 수집 로봇
        allow: "/",
      },
      {
        userAgent: "Googlebot", // 구글 서치콘솔 수집 로봇
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
