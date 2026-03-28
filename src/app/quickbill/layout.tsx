import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "QuickBill | 가입 없는 영문/국문 10초 완성 인보이스 생성기",
  description: "무거운 워드, 엑셀 켜지 마세요. 웹에서 바로 타이핑하고 PDF로 10초만에 구워내는 글로벌 호환 무료 인보이스 제네레이터입니다.",
  keywords: ["인보이스 양식", "무료 인보이스", "영문 견적서", "프리랜서 청구서", "PDF 영수증", "수기 계산서 양식"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
