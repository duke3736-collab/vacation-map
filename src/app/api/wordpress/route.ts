import { NextResponse } from "next/server";

// HTML 태그 제거를 위한 정규식 헬퍼 함수
function stripHtmlTags(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&#8211;/g, "-").replace(/&#8217;/g, "'").trim();
}

export async function GET() {
  try {
    // 사용자의 워드프레스 블로그 API 주소 (최신글 3개 및 임베드 미디어 포함 요청)
    const wordpressUrl = "https://weknews.com/wp-json/wp/v2/posts?_embed&per_page=3";
    
    // 5초 타임아웃을 설정한 fetch 요청
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(wordpressUrl, {
      signal: controller.signal,
      next: { revalidate: 300 } // 5분 동안 캐싱하여 서버 성능 및 API 호출 제한 최적화
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`WordPress API returned status ${response.status}`);
    }

    const posts = await response.json();
    
    // 프론트엔드에 필요한 정제된 포스트 데이터 매핑
    const formattedPosts = posts.map((post: any) => {
      // 썸네일 이미지 추출 (Featured Media 가 없을 시 기본 정보성 비즈니스 이미지 매핑)
      const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
      const imageUrl = featuredMedia?.source_url || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=60";
      
      // 카테고리 텍스트 추출 (첫 번째 카테고리가 매핑되어 있다면 사용, 기본값 '생활 꿀팁')
      const categoryName = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "생활 정보";

      return {
        id: post.id,
        title: stripHtmlTags(post.title?.rendered || "새로운 소식"),
        excerpt: stripHtmlTags(post.excerpt?.rendered || "자세한 내용을 확인해 보세요."),
        category: categoryName,
        date: post.date ? post.date.split("T")[0] : new Date().toISOString().split("T")[0],
        imageUrl: imageUrl,
        link: post.link
      };
    });

    return NextResponse.json(formattedPosts);

  } catch (error) {
    console.error("Error fetching WordPress posts in server route:", error);
    // ⚠️ 오류 발생 시 프론트엔드가 중단되지 않도록 빈 배열을 반환합니다.
    // 프론트엔드는 이를 감지해 내장된 3개의 멋진 정부지원금 Fallback 카드를 보여주게 됩니다.
    return NextResponse.json([]);
  }
}
