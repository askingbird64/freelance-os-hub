"use client";

import { useEffect, useState } from "react";
import { Lock, Zap, Clock } from "lucide-react";

export default function AdModal({
  isOpen,
  onComplete
}: {
  isOpen: boolean;
  onComplete: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (!isOpen) return;
    
    setTimeLeft(10); // 리셋
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete(); // 10초 경과 시 강제 완료 트리거
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        
        {/* Header - Countdown */}
        <div className="bg-slate-50 border-b border-slate-100 p-6 text-center space-y-2 relative">
          <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
            <Clock className="w-5 h-5 animate-pulse" />
            <span className="font-black text-2xl tracking-tight">{timeLeft}초 뒤 결과가 생성됩니다</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">최상의 결과물을 위해 엔진이 렌더링을 진행 중입니다...</p>
          
          <div className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-1000 ease-linear" style={{ width: `${(10 - timeLeft) * 10}%` }}></div>
        </div>

        {/* Ad Area (AdSense Placeholder) */}
        <div className="p-6">
          <div className="w-full h-[250px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden group">
            <div className="text-center z-10 space-y-2">
              <span className="text-slate-400 font-bold block bg-white px-3 py-1 rounded-full text-xs shadow-sm mx-auto w-max">Advertisement</span>
              <span className="text-slate-400 text-sm block">구글 애드센스 전면 광고 노출 배너 영역</span>
            </div>
          </div>
        </div>

        {/* Premium Banner */}
        <div className="bg-indigo-600 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-black flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              답답하신가요? 10초 대기를 없애세요.
            </h4>
            <p className="text-indigo-200 text-xs font-medium">프리미엄 결제 시 평생 대기열 및 광고 무제한 영구 스킵</p>
          </div>
          <button className="shrink-0 bg-white text-indigo-900 px-5 py-2.5 rounded-xl font-black text-sm hover:bg-indigo-50 transition-colors shadow-lg active:scale-95 flex items-center gap-2 group">
            <Lock className="w-4 h-4 group-hover:text-rose-500 transition-colors" />
            프리미엄 알아보기
          </button>
        </div>

      </div>
    </div>
  );
}
