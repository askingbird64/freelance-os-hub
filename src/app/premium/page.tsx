export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-amber-400 to-rose-500 text-transparent bg-clip-text tracking-tighter">
          시간을 돈으로 바꾸는 가장 빠른 방법
        </h1>
        <p className="text-xl text-slate-400 font-medium">단 1초의 기다림도 없이 모든 도구를 제약 없이 사용하세요.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 text-left">
          
          {/* Free Tier */}
          <div className="bg-slate-800 rounded-3xl p-8 border border-white/5 opacity-70">
            <h3 className="text-2xl font-bold text-slate-300 mb-2">Freemium (기본)</h3>
            <p className="text-4xl font-black mb-8 text-white">₩ 0<span className="text-lg font-medium text-slate-500"> / 평생</span></p>
            <ul className="space-y-4 mb-10 text-slate-400 font-medium">
              <li>✓ 모든 5개 생산성 툴 무료 이용</li>
              <li>✓ 결과 산출 시 <strong className="text-white">10초 대기열 강제 적용</strong></li>
              <li>✓ 화면 곳곳에 전면 광고 노출</li>
              <li>✓ 데이터 저장 및 히스토리 무제공</li>
            </ul>
            <button disabled className="w-full py-4 rounded-xl bg-slate-700 text-slate-500 font-bold cursor-not-allowed">현재 사용 중인 플랜</button>
          </div>

          {/* Premium Tier */}
          <div className="bg-slate-800 rounded-3xl p-8 border-2 border-rose-500 shadow-2xl shadow-rose-500/20 relative transform scale-105">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-orange-400 to-rose-500 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-lg">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-rose-400 mb-2 flex items-center gap-2">🔥 Premium Pro</h3>
            <p className="text-4xl font-black mb-8 text-white">₩ 9,900<span className="text-lg font-medium text-slate-400"> / 월</span></p>
            <ul className="space-y-4 mb-10 text-slate-200 font-medium">
              <li><strong className="text-rose-400">✓ 10초 강제 대기열 영구 삭제 (즉시 결과물 산출)</strong></li>
              <li><strong className="text-rose-400">✓ 모든 상하단 배너 및 전면 광고 100% 제거</strong></li>
              <li>✓ VIP 전용 초고속 클라우드 엣지 라우팅 적용</li>
              <li>✓ 향후 추가될 모든 프리랜서 생산성 툴 사전 점검 권한</li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-black text-lg shadow-lg shadow-rose-500/30 transition-transform active:scale-95">
              프리미엄 혜택 즉시 활성화하기
            </button>
            <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">결제 즉시 로컬 스토리지에 암호화된 Premium 토큰이 발급되어<br/>DB 없이도 모든 툴의 잠금이 영구 해제됩니다.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
