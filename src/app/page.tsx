import Link from "next/link";
import { ArrowRight, Zap, Shield, Clock, Calculator, Database } from "lucide-react";

// 프리랜서 OS 코어 툴 5종 리스트업
const tools = [
  {
    id: "pain-extractor",
    name: "PainExtractor",
    desc: "레딧에서 프리랜서 고충 데이터를 채굴하는 원시 데이터 엔진",
    icon: "/logo-pain.png",
    gradient: "from-amber-400 to-yellow-600",
    shadow: "shadow-amber-500/20",
    tags: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  {
    id: "timesync",
    name: "TimeSync",
    desc: "100% 무상태(Stateless) 글로벌 미팅 타임존 자동 변환기",
    icon: "/logo-time.png",
    gradient: "from-cyan-400 to-blue-600",
    shadow: "shadow-cyan-500/20",
    tags: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
  },
  {
    id: "quickbill",
    name: "QuickBill",
    desc: "가입이나 서버 연산 없이 즉각 출력되는 10초 완성 인보이스",
    icon: "/logo-bill.png",
    gradient: "from-emerald-400 to-teal-600",
    shadow: "shadow-emerald-500/20",
    tags: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  {
    id: "scopeguard",
    name: "ScopeGuard",
    desc: "기한 초과와 무한 수정 요구를 차단하는 단호박 방어 이메일 엔진",
    icon: "/logo-scope.png",
    gradient: "from-indigo-400 to-violet-600",
    shadow: "shadow-indigo-500/20",
    tags: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
  },
  {
    id: "truerate",
    name: "TrueRate",
    desc: "숨은 고정비와 세금을 반영하여 진짜 생존 시급을 팩트폭행하는 계산기",
    icon: "/logo-rate.png",
    gradient: "from-rose-400 to-orange-600",
    shadow: "shadow-rose-500/20",
    tags: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  },
  {
    id: "smart-renamer",
    name: "SmartRenamer",
    desc: "업로드 없이 로컬 브라우저에서 파편화된 파일 이름을 0.1초 만에 1,000개 일괄 자동 수정",
    icon: "/logo.png",
    gradient: "from-sky-400 to-blue-600",
    shadow: "shadow-sky-500/20",
    tags: "bg-sky-500/10 text-sky-400 border-sky-500/20"
  }
];

export default function HubHome() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white pb-32">
      
      {/* Background Glow Effect */}
      <div className="fixed top-0 inset-x-0 h-[500px] pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/15 blur-[120px] rounded-full"></div>
      </div>

      <header className="relative z-10 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
              OS
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">FreelanceOS <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white/10 text-slate-300 ml-1 uppercase tracking-widest border border-white/5">HUB</span></h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">HANWOOLMAN 제작</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10"><Zap className="w-3.5 h-3.5 text-yellow-500"/> 100% Stateless Edge App</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold text-xs uppercase tracking-widest mb-2">
            프리랜서를 구원할 마지막 도구 상자 🧰
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1]">
            서버비 0원의 기적,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">오직 독립 워커를 위해.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mt-6">
            업무에 치이는 프리랜서와 1인 에이전시 전용 무상태(Stateless) 도구 모음입니다. 
            단 한 번의 다운로드나 가입도 필요 없습니다. 클릭하는 즉시, 바로 내 브라우저에서 구동됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <Link href={`/${tool.id}`} key={tool.id} className="group relative bg-slate-900 border border-white/5 rounded-3xl p-8 hover:bg-slate-800 transition-all duration-300 hover:border-white/10 hover:-translate-y-1 block shadow-xl shadow-black/50 overflow-hidden" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <img src={tool.icon} alt={tool.name} className={`w-14 h-14 rounded-2xl shadow-xl ${tool.shadow} border border-white/10 group-hover:scale-105 transition-transform duration-300`} />
                <div className="w-10 h-10 rounded-full bg-slate-950/80 border border-white/5 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-colors shadow-inner">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-black text-white tracking-tight">{tool.name}</h3>
                <p className="text-slate-400 font-medium leading-relaxed min-h-[50px]">{tool.desc}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm border ${tool.tags}`}>Stateless</span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1 group-hover:text-white transition-colors">바로 시작하기 <ArrowRight className="w-3 h-3"/></span>
              </div>
            </Link>
          ))}

          {/* Coming Soon Placeholder */}
          <div className="bg-slate-900/40 border border-white/5 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-inner min-h-[250px]">
            <div className="w-14 h-14 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
              <span className="text-xl">⏳</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-500 mb-1 tracking-tight">More Tools Coming</h3>
              <p className="text-sm text-slate-600 font-medium">비즈니스를 아껴줄 다음 코어 툴을<br/>치열하게 설계 중입니다.</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* 10초 광고 프리미엄 티저 프로모션 띠바 (추후 컴포넌트 분리) */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-promo {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 2s forwards;
        }
      `}</style>
      <div className="fixed bottom-0 inset-x-0 bg-indigo-600 text-white py-3 px-6 z-50 transform translate-y-full opacity-0 animate-promo border-t border-indigo-500/50 shadow-[0_-10px_40px_-5px_rgba(79,70,229,0.5)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold flex items-center gap-2">⭐ 대기 시간 10초를 영원히 삭제하세요! 100% Ads-Free 프리미엄 출시</p>
          <Link href="/premium" className="px-5 py-2 bg-white text-indigo-600 text-xs font-black rounded-lg hover:bg-slate-100 transition-colors shadow-lg active:scale-95 border border-indigo-200 whitespace-nowrap">프리미엄 혜택 알아보기</Link>
        </div>
      </div>

    </div>
  );
}
