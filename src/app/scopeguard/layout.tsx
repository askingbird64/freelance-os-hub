import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ScopeGuard | 프리랜서 호구 방어 & 정중한 거절 이메일 템플릿 엔진",
  description: "무한 수정 요구, 무급 추가 업무 요구, 잔금 지연. 감정노동 없이 복붙 한 번으로 끝내는 기적의 B2B 방어 이메일 템플릿 생성기입니다.",
  keywords: ["거절 이메일 양식", "프리랜서 계약", "호구 방어", "추가금 요구 양식", "수정 요청 거절", "내용 증명", "대금 지불 지연 양식"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
