import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "TrueRate | 프리랜서 진짜 생존 단가 팩트폭행 계산기",
  description: "연봉 5천을 원하시나요? 숨은 세금, 월세, 유지비, 낭비되는 작업 시간을 역산하여 당신이 절대 양보해선 안 될 프리랜서 전용 진짜 시급을 계산해 드립니다.",
  keywords: ["프리랜서 단가", "외주 시급 계산기", "프로젝트 단가표", "세후 연봉 계산", "디자인 외주 단가", "개발 외주 비용표"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
