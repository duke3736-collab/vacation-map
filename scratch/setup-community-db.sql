-- ========================================================
-- 방학맵(vacation-map) 커뮤니티 데이터베이스 테이블 생성 SQL
-- Supabase SQL Editor에서 복사하여 실행하시면 됩니다.
-- ========================================================

-- 1. 게시글 테이블 생성
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT '자유',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  nickname TEXT NOT NULL,
  like_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 댓글 테이블 생성
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  nickname TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS (Row Level Security) 활성화
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- 4. 게시글 RLS 정책 (누구나 읽기/쓰기/수정 가능)
DROP POLICY IF EXISTS "Allow public read access on community_posts" ON community_posts;
CREATE POLICY "Allow public read access on community_posts" ON community_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on community_posts" ON community_posts;
CREATE POLICY "Allow public insert on community_posts" ON community_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on community_posts" ON community_posts;
CREATE POLICY "Allow public update on community_posts" ON community_posts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on community_posts" ON community_posts;
CREATE POLICY "Allow public delete on community_posts" ON community_posts FOR DELETE USING (true);

-- 5. 댓글 RLS 정책
DROP POLICY IF EXISTS "Allow public read access on community_comments" ON community_comments;
CREATE POLICY "Allow public read access on community_comments" ON community_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on community_comments" ON community_comments;
CREATE POLICY "Allow public insert on community_comments" ON community_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on community_comments" ON community_comments;
CREATE POLICY "Allow public delete on community_comments" ON community_comments FOR DELETE USING (true);

-- 6. 샘플 데이터 입력
INSERT INTO community_posts (category, title, content, nickname, like_count, view_count) VALUES
('방학후기', '🏖️ 초등학생 아이와 함께 다녀온 국립중앙박물관 사유의 방 후기!', '이번 방학을 맞이해 초등 3학년 아이와 함께 국립중앙박물관에 다녀왔습니다. 반가사유상이 전시된 사유의 방은 조용하고 몽환적인 분위기라 아이도 감탄하더라고요!', '방학마스터', 24, 142),
('정보공유', '📢 2026 여름방학 서울시 무료 어린이 체험 프로그램 총정리', '서울시 생태공원 및 박물관에서 진행하는 방학 특별 무료 체험 프로그램 일정입니다.', '정보통맘', 45, 389),
('질문', '❓ 초등 4학년 방학 동안 가볼 만한 과학관 추천해주세요!', '국립과천과학관은 지난 방학 때 다녀왔는데 이번에는 조금 색다른 우주/로봇 관련 체험관을 찾고 있습니다.', '탐구왕아빠', 12, 98),
('방학후기', '🏰 경복궁 야간개장 한복 입고 아이들과 다녀왔어요', '시원한 여름밤 경복궁 야간 투어 다녀왔습니다! 한복 착용자는 무료 입장 혜택이 있어서 온 가족이 한복 맞춰 입고 다녀왔네요.', '한복나들이', 38, 215),
('자유', '💬 방학 시작 2주차... 모든 부모님들 화이팅입니다! 😂', '삼시세끼 챙기랴, 체험학습 계획 짜랴 매일매일 바쁘지만 아이가 박물관에서 신나게 체험하는 모습 보면 뿌듯하네요!', '슬기로운방학', 53, 310);
