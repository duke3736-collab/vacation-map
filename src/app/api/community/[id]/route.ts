import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { readPosts, writePosts, Post } from "../route";

export interface Comment {
  id: string;
  post_id: string;
  content: string;
  nickname: string;
  created_at: string;
}

const COMMENTS_FILE = path.join(process.cwd(), "src/data/user_comments.json");
const TMP_COMMENTS_FILE = "/tmp/vacation_community_comments.json";

function getCommentsFilePath() {
  if (process.env.NODE_ENV === "production") {
    return TMP_COMMENTS_FILE;
  }
  return COMMENTS_FILE;
}

function readComments(): Comment[] {
  const targetPath = getCommentsFilePath();
  try {
    if (fs.existsSync(targetPath)) {
      return JSON.parse(fs.readFileSync(targetPath, "utf-8"));
    }
  } catch (e) {}

  try {
    if (fs.existsSync(COMMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf-8"));
    }
  } catch (e) {}

  return [];
}

function writeComments(comments: Comment[]) {
  const targetPath = getCommentsFilePath();
  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(targetPath, JSON.stringify(comments, null, 2), "utf-8");
  } catch (e) {}

  if (process.env.NODE_ENV !== "production") {
    try {
      const dir = path.dirname(COMMENTS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2), "utf-8");
    } catch (e) {}
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const posts = readPosts();
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Increment view count
  posts[postIndex].view_count = (posts[postIndex].view_count || 0) + 1;
  writePosts(posts);

  const comments = readComments().filter((c) => c.post_id === id);

  return NextResponse.json({ post: posts[postIndex], comments });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { type, content, nickname, action } = body;

    const posts = readPosts();
    const postIndex = posts.findIndex((p) => p.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (type === "like") {
      if (action === "unlike") {
        posts[postIndex].like_count = Math.max(0, (posts[postIndex].like_count || 0) - 1);
      } else {
        posts[postIndex].like_count = (posts[postIndex].like_count || 0) + 1;
      }
      writePosts(posts);
      return NextResponse.json({ post: posts[postIndex] });
    }

    if (type === "comment") {
      if (!content || !nickname) {
        return NextResponse.json({ error: "Missing content or nickname" }, { status: 400 });
      }

      const comments = readComments();
      const newComment: Comment = {
        id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        post_id: id,
        content: content.trim(),
        nickname: nickname.trim(),
        created_at: new Date().toISOString(),
      };

      comments.push(newComment);
      writeComments(comments);

      // Update post comment count
      posts[postIndex].comment_count = (posts[postIndex].comment_count || 0) + 1;
      writePosts(posts);

      return NextResponse.json({ comment: newComment });
    }

    return NextResponse.json({ error: "Invalid operation type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("commentId");

  if (commentId) {
    // Delete single comment
    let comments = readComments();
    comments = comments.filter((c) => c.id !== commentId);
    writeComments(comments);
    return NextResponse.json({ success: true });
  }

  // Delete post and its comments
  let posts = readPosts();
  posts = posts.filter((p) => p.id !== id);
  writePosts(posts);

  let comments = readComments();
  comments = comments.filter((c) => c.post_id !== id);
  writeComments(comments);

  return NextResponse.json({ success: true });
}
