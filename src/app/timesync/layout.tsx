import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "TimeSync | 글로벌 시차 계산 없는 마법의 미팅 링크 생성기",
  description: "해외 클라이언트와 미팅 잡을 때 시차 계산에 고통받지 마세요. 이 링크 하나만 보내면 현지 타임존으로 자동 변환된 시간이 즉시 렌더링됩니다.",
  keywords: ["시차 계산기", "글로벌 미팅", "해외 프리랜서", "타임존 변환", "TimeSync", "미팅 예약"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
