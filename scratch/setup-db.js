const { Client } = require("pg");

const connectionString = "postgresql://postgres:k3dbiNgey1647HGY@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres";

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
    servername: "db.pjoakjbqlakczbhbhtxn.supabase.co"
  }
});

const sqlQueries = `
  -- 1. 사진 저장 테이블 생성
  CREATE TABLE IF NOT EXISTS place_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    place_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- RLS 활성화
  ALTER TABLE place_photos ENABLE ROW LEVEL SECURITY;

  -- 2. RLS 정책 생성 (누구나 읽기 가능)
  DROP POLICY IF EXISTS "Allow public read access" ON place_photos;
  CREATE POLICY "Allow public read access" ON place_photos
    FOR SELECT USING (true);

  -- 3. RLS 정책 생성 (인증된 회원만 업로드 가능)
  DROP POLICY IF EXISTS "Allow authenticated insert" ON place_photos;
  CREATE POLICY "Allow authenticated insert" ON place_photos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  -- 4. Storage Bucket 생성 (place-photos)
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('place-photos', 'place-photos', true)
  ON CONFLICT (id) DO NOTHING;

  -- 5. Storage Objects RLS 정책 생성 (누구나 읽기 가능)
  DROP POLICY IF EXISTS "Allow public select on place-photos" ON storage.objects;
  CREATE POLICY "Allow public select on place-photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'place-photos');

  -- 6. Storage Objects RLS 정책 생성 (인증된 사용자만 업로드 가능)
  DROP POLICY IF EXISTS "Allow authenticated insert on place-photos" ON storage.objects;
  CREATE POLICY "Allow authenticated insert on place-photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'place-photos' AND auth.role() = 'authenticated');
`;

async function run() {
  console.log("Connecting to Supabase PostgreSQL database...");
  try {
    await client.connect();
    console.log("Connected successfully. Running SQL queries...");
    await client.query(sqlQueries);
    console.log("All tables, buckets, and policies created successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();
