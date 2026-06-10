import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "방학 맵 (Vacation Map) | 지도 기반 전국 방학 체험학습 & 나들이 추천",
  description: "초등학생 및 중학생 자녀의 방학을 알차게 보내기 위한 지도 기반 원스톱 정보 플랫폼. 무료 체험학습 명소, 박물관 도슨트 투어, 축제, 물놀이 추천 및 학교 제출용 교외 현장체험학습 신청서/결과보고서 양식 자동 완성 기능을 제공합니다.",
  keywords: [
    "방학맵",
    "방학 맵",
    "교외체험학습 신청서",
    "체험학습 보고서",
    "현장체험학습 신청서 작성법",
    "체험학습 결과보고서 양식",
    "어린이 박물관",
    "도슨트 투어 예약",
    "방학 아이와 가볼만한곳",
    "초등학생 체험학습 추천",
    "여름방학 갈만한곳",
    "겨울방학 나들이",
    "가족 여행지 추천",
    "물놀이 필수 준비물"
  ],
  authors: [{ name: "방학 맵" }],
  creator: "방학 맵",
  publisher: "방학 맵",
  metadataBase: new URL("https://vacation.weknews.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "방학 맵 (Vacation Map) | 지도 기반 전국 방학 체험학습 & 나들이 추천",
    description: "초등학생 및 중학생 자녀의 방학을 위한 지도 기반 원스톱 정보 플랫폼. 무료 체험학습 명소, 박물관 도슨트, 물놀이 추천 및 학교 제출용 보고서 양식 자동 완성 기능을 제공합니다.",
    url: "https://vacation.weknews.com",
    siteName: "방학 맵 (Vacation Map)",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/bg_museum.png",
        width: 1200,
        height: 630,
        alt: "방학 맵 (Vacation Map)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "방학 맵 (Vacation Map) | 지도 기반 전국 방학 체험학습 & 나들이 추천",
    description: "초등학생 및 중학생 자녀의 방학을 위한 지도 기반 원스톱 정보 플랫폼. 무료 체험학습 명소, 박물관 도슨트, 물놀이 추천 및 학교 제출용 보고서 양식 자동 완성 기능을 제공합니다.",
    images: ["/images/bg_museum.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "naver-site-verification": ["f06535ad9461630a49f7b3747e10eff57ae550c1"],
    },
  },
};

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import FloatingAds from "@/components/FloatingAds";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6635245275061755" crossOrigin="anonymous"></script>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${jakarta.variable} antialiased text-slate-900`}>
        <div className="fixed top-0 w-full z-50 pointer-events-auto print:hidden">
          <Header />
          <FloatingAds />
        </div>
        <main className="min-h-screen">
          {children}
        </main>
        <div className="pointer-events-auto print:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
