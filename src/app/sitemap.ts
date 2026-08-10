import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { Post } from "@/data/initialPosts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vacation.weknews.com";

  // 읽어올 게시글 목록
  let posts: Post[] = [];
  try {
    const filePath = path.join(process.cwd(), "src/data/user_posts.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      posts = JSON.parse(data);
    }
  } catch (e) {}

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/community/${post.id}`,
    lastModified: new Date(post.created_at || Date.now()),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/talk`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/themes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/planner`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...postUrls,
  ];
}
