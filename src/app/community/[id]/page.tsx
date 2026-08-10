import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { Post } from "@/data/initialPosts";
import CommunityDetailClient from "./CommunityDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getPostByIdServer(id: string): Post | null {
  const filePath = path.join(process.cwd(), "src/data/user_posts.json");
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const posts: Post[] = JSON.parse(data);
      return posts.find((p) => p.id === id) || null;
    }
  } catch (e) {}
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const post = getPostByIdServer(id);

  if (!post) {
    return {
      title: "방학 이야기 | 방학 맵 (VACATION MAP)",
      description: "방학 여행 후기, 질문, 정보 공유 커뮤니티",
    };
  }

  const title = `${post.title} | 방학 맵 커뮤니티`;
  const description = post.content.replace(/<[^>]*>/g, "").slice(0, 160);
  const url = `https://vacation.weknews.com/community/${id}`;

  return {
    title: title,
    description: description,
    keywords: `${post.category}, 방학 여행, 커뮤니티, 방학 이야기, 체험학습`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title,
      description: description,
      url: url,
      siteName: "방학 맵 (VACATION MAP)",
      locale: "ko_KR",
      type: "article",
      publishedTime: post.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const post = getPostByIdServer(id);

  const jsonLd = post ? {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": post.title,
    "articleBody": post.content.replace(/<[^>]*>/g, ""),
    "author": {
      "@type": "Person",
      "name": post.nickname || "익명",
    },
    "datePublished": post.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://vacation.weknews.com/community/${post.id}`,
    },
    "interactionStatistic": [
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/WatchAction",
        "userInteractionCount": post.view_count || 1,
      },
      {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/LikeAction",
        "userInteractionCount": post.like_count || 0,
      },
    ],
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CommunityDetailClient id={id} initialPost={post} />
    </>
  );
}
