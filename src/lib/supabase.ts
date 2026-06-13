import { createClient } from "@supabase/supabase-js";

// 환경변수에서 Supabase URL과 Key를 가져옵니다.
// .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해야 합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 환경변수가 없으면 임시 Mock 모드로 동작하거나 에러를 방지합니다.
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// 사진 신고 사유 목록
export const REPORT_REASONS = [
  "장소와 무관한 사진입니다.",
  "선정적이거나 폭력적인 사진입니다.",
  "저작권을 침해하는 사진입니다.",
  "광고, 스팸성 사진입니다.",
  "기타 부적절한 사진입니다."
];
