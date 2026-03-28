import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SmartRenamer | 브라우저 전용 로컬 대량 파일 이름 변경 유틸리티",
  description: "난장판이 된 파일 1000개의 이름을 1초만에 규칙적으로 싹 바꿔드립니다. 서버 업로드 전송 없이 브라우저 단독 처리로 보안 누출률 0% 달성.",
  keywords: ["파일 이름 일괄 변경", "에셋 이름 대량 정리", "파일명 일괄 수정", "로컬 유틸리티 막일", "파일 자동 정리", "디자인 에셋 관리"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
