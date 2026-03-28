import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PainExtractor | 해외 고객 레딧 페인포인트 AI 자동 추출기",
  description: "Reddit(레딧) 등 해외 커뮤니티의 방대한 영문 데이터를 긁어와 AI로 고객의 진짜 불만(Pain Point)을 한글 리포트로 10초만에 추출해드립니다.",
  keywords: ["해외 마케팅", "페인포인트", "레딧 크롤링", "AI 트렌드 분석", "고객 불만 분석", "시장 조사"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
