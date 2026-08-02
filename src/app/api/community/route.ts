import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";

export interface Post {
  id: string;
  category: "방학후기" | "질문" | "정보공유" | "자유";
  title: string;
  content: string;
  nickname: string;
  like_count: number;
  view_count: number;
  created_at: string;
  comment_count?: number;
}

const DATA_FILE = path.join(process.cwd(), "src/data/user_posts.json");
const TMP_FILE = "/tmp/vacation_community_posts.json";

function getFilePath() {
  if (process.env.NODE_ENV === "production") {
    return TMP_FILE;
  }
  return DATA_FILE;
}

export function readPosts(): Post[] {
  const targetPath = getFilePath();
  try {
    if (fs.existsSync(targetPath)) {
      const data = fs.readFileSync(targetPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to read posts from target path:", e);
  }

  // Fallback to DATA_FILE if targetPath failed
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {}

  return [];
}

export function writePosts(posts: Post[]) {
  const targetPath = getFilePath();
  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, JSON.stringify(posts, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write posts:", e);
  }

  // Also write to DATA_FILE in development
  if (process.env.NODE_ENV !== "production") {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
    } catch (e) {}
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "latest";

  if (supabase) {
    try {
      let query = supabase.from("community_posts").select("*");
      if (category && category !== "전체") {
        query = query.eq("category", category);
      }
      if (sort === "popular") {
        query = query.order("like_count", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }
      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json(data);
      }
      if (error) {
        console.warn("Supabase query error, falling back to local files:", error.message);
      }
    } catch (err) {
      console.warn("Supabase GET error, falling back to local files:", err);
    }
  }

  let posts = readPosts();

  if (category && category !== "전체") {
    posts = posts.filter((p) => p.category === category);
  }

  if (sort === "popular") {
    posts.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
  } else {
    posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, title, content, nickname } = body;

    if (!title || !content || !nickname) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (supabase) {
      try {
        const newPost = {
          category: category || "자유",
          title: title.trim(),
          content: content.trim(),
          nickname: nickname.trim(),
          like_count: 0,
          view_count: 1,
        };
        const { data, error } = await supabase
          .from("community_posts")
          .insert(newPost)
          .select()
          .single();
        if (!error && data) {
          return NextResponse.json(data);
        }
        if (error) {
          console.error("Supabase insert error, falling back to local files:", error.message);
        }
      } catch (err) {
        console.error("Supabase POST error, falling back to local files:", err);
      }
    }

    const posts = readPosts();
    const newPost: Post = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      category: category || "자유",
      title: title.trim(),
      content: content.trim(),
      nickname: nickname.trim(),
      like_count: 0,
      view_count: 1,
      created_at: new Date().toISOString(),
      comment_count: 0,
    };

    posts.unshift(newPost);
    writePosts(posts);

    return NextResponse.json(newPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

