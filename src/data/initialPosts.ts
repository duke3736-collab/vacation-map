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

export interface Comment {
  id: string;
  post_id: string;
  content: string;
  nickname: string;
  created_at: string;
}

export const INITIAL_POSTS: Post[] = [];
export const INITIAL_COMMENTS: Record<string, Comment[]> = {};
