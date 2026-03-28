"use client";

import { useState } from "react";
import AdModal from "../../components/AdModal";
import { Lock } from "lucide-react";

export default function TrueRateMvp() {
  // 1. 재무 목표
  const [targetTakeHome, setTargetTakeHome] = useState<number>(50000000); // 5000만 원
  const [taxRate, setTaxRate] = useState<number>(15); // 세금 및 4대보험 예상치 15%
  const [annualExpenses, setAnnualExpenses] = useState<number>(3600000); // 월 30만원 고정비 (연 360만)

  // 2. 시간 설정 (현실)
  const [vacationDays, setVacationDays] = useState<number>(15); // 연차
  const [sickDays, setSickDays] = useState<number>(5); // 병가 등 로스
  const [hoursPerDay, setHoursPerDay] = useState<number>(8); // 하루 근무 시간
  const [billableRatio, setBillableRatio] = useState<number>(50); // 실제 돈 받는 작업 시간 비율 (나머진 미팅/영업)

  // --- 계산 로직 (Stateless) ---
  const WORKDAYS_IN_YEAR = 260; // 52주 * 5일
  const availableWorkDays = WORKDAYS_IN_YEAR - vacationDays - sickDays;
  const totalWorkHours = availableWorkDays * hoursPerDay;
  const billableHours = Math.floor(totalWorkHours * (billableRatio / 100));

  // 그로스(세전) 목표 = (세후목표 / (1 - 세율)) + 연간 고정비
  const grossIncomeNeeded = Math.floor(targetTakeHome / (1 - (taxRate / 100))) + annualExpenses;

  // 진실의 단가
  const trueHourlyRate = Math.ceil(grossIncomeNeeded / billableHours / 1000) * 1000;
  const trueDailyRate = trueHourlyRate * hoursPerDay;

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 복사 기능
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const text = `[외주 단가 산정의 근거]\n- 세후 목표 수익: ${(targetTakeHome/10000).toLocaleString()}만 원\n- 연간 고정비/세금 반영 세전 매출 목표: ${(grossIncomeNeeded/10000).toLocaleString()}만 원\n- 연간 실제 청구 가능 시간(Billable Hours): ${billableHours}시간\n- 산출된 최소 시간당 단가: ${trueHourlyRate.toLocaleString()}원\n\n이에 따라 본 프로젝트(추정 투입시간 00시간)의 견적을 안내해 드립니다.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 selection:bg-rose-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6 pb-8 sticky top-0 bg-slate-900/80 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="TrueRate Logo" className="w-12 h-12 rounded-2xl shadow-lg shadow-rose-500/30 border border-rose-400/50" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-2xl font-black tracking-tight text-white leading-tight">
                  TrueRate <span className="text-rose-500 text-sm align-top tracking-widest px-2 border border-rose-500/40 rounded-full ml-1">MVP</span>
                </h1>
                <span className="text-[10px] font-bold bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded-sm border border-rose-500/30 tracking-widest">HANWOOLMAN 제작</span>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Freelancer Survival Calculator</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-slate-400 tracking-wider">
              100% Stateless • Zero DB • Cloudflare Optimized
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Input Form */}
        <div className="lg:col-span-5 space-y-12">
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">당신의 목표는 <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">얼마짜리 인생</span>입니까?</h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              연봉 5천을 벌고 싶다면 시급 2만 5천 원으로는 절대 불가능합니다. 
              숨만 쉬어도 나가는 세금, 장비값, 그리고 당신의 버려지는 시간을 계산하세요.
            </p>
          </div>

          <form className="space-y-8 bg-slate-800/50 p-8 rounded-[32px] border border-white/5 shadow-2xl">
            
            {/* Step 1: Money */}
            <div className="space-y-5">
              <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center">1</span> 
                재무 목표 (목표 연봉)
              </h3>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-300">내 통장에 찍혔으면 하는 현실적인 연봉</label>
                  <span className="text-sm font-black text-white">{(targetTakeHome / 10000).toLocaleString()}만 원</span>
                </div>
                <input 
                  type="range" min="20000000" max="150000000" step="5000000" 
                  value={targetTakeHome} onChange={e => setTargetTakeHome(Number(e.target.value))}
                  className="w-full accent-rose-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">예상 세율 (소득세/종소세 등) %</label>
                  <div className="relative">
                    <input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-rose-500 outline-none" />
                    <span className="absolute right-4 top-3 text-slate-500 font-bold">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">연간 고정비 (소프트웨어 등)</label>
                  <div className="relative">
                    <input type="number" value={annualExpenses} onChange={e => setAnnualExpenses(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-rose-500 outline-none" />
                    <span className="absolute right-4 top-3 text-slate-500 font-bold">원</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Step 2: Time (Reality) */}
            <div className="space-y-5">
              <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">2</span> 
                시간의 현실 (청구 가능 시간)
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">연간 휴가 일수</label>
                  <div className="relative">
                    <input type="number" value={vacationDays} onChange={e => setVacationDays(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-orange-500 outline-none" />
                    <span className="absolute right-4 top-3 text-slate-500 font-bold">일</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">연간 병가/경조사 대비</label>
                  <div className="relative">
                    <input type="number" value={sickDays} onChange={e => setSickDays(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-orange-500 outline-none" />
                    <span className="absolute right-4 top-3 text-slate-500 font-bold">일</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-300">실제 돈 받는 작업 시간 (Billable Ratio)</label>
                  <span className="text-sm font-black text-orange-400">{billableRatio}%</span>
                </div>
                <input 
                  type="range" min="10" max="100" step="5" 
                  value={billableRatio} onChange={e => setBillableRatio(Number(e.target.value))}
                  className="w-full accent-orange-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-2 font-medium">프리랜서는 영수증 처리, 고객 미팅, 포트폴리오 작업 등 돈 안되는 시간에 하루의 절반을 씁니다. 통상 40~60%가 현실입니다.</p>
              </div>

            </div>

          </form>
        </div>

        {/* Right: Output Calculation */}
        <div className="lg:col-span-7 inset-y-0">
          
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

            <div className="relative z-10">
              <div className={`space-y-12 transition-all duration-700 ${!isUnlocked ? 'blur-[12px] select-none opacity-40 pointer-events-none' : ''}`}>
              
              {/* Gross Goal */}
              <div className="border-b border-white/10 pb-8">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">당신이 실제로 뚫어야 하는 1년 총매출(세전)</h3>
                <div className="text-5xl font-black text-white tracking-tighter">
                  {(grossIncomeNeeded / 10000).toLocaleString()} <span className="text-2xl text-slate-500 tracking-normal">만 원</span>
                </div>
                <p className="text-sm text-rose-400 font-bold mt-3 bg-rose-500/10 inline-block px-3 py-1 rounded-md">
                  세후 {(targetTakeHome / 10000).toLocaleString()}만원을 가져가기 위해선 세금과 유지비를 이만큼 더 벌어야 합니다.
                </p>
              </div>

              {/* Time Reality */}
              <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-8">
                <div>
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">1년 중 일하는 날짜</h3>
                  <div className="text-3xl font-black text-white">{availableWorkDays} <span className="text-lg text-slate-500">일</span></div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">주말과 휴가 {vacationDays+sickDays}일을 제외</p>
                </div>
                <div>
                  <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-widest mb-2">1년 중 청구 가능한 시간</h3>
                  <div className="text-3xl font-black text-white">{billableHours.toLocaleString()} <span className="text-lg text-slate-500">시간</span></div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">비 청구업무(영업/미팅)를 뺀 순수 작업시간</p>
                </div>
              </div>

              {/* THE TRUE RATE */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10 relative overflow-hidden backdrop-blur-sm -mx-4 md:mx-0">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-orange-500/20 opacity-50"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-black text-rose-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                    🔥 굶어죽지 않기 위한 최소 시급 (True Hourly Rate)
                  </h3>
                  <div className="text-[56px] md:text-[72px] font-black text-white tracking-tighter leading-none mb-4">
                    {trueHourlyRate.toLocaleString()}<span className="text-3xl text-rose-200 tracking-normal ml-2">원</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-8">
                    <div className="bg-black/40 px-4 py-3 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">최소 일당 (8h)</p>
                      <p className="text-xl font-black text-white">{trueDailyRate.toLocaleString()} 원</p>
                    </div>
                    <div className="bg-black/40 px-4 py-3 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">1주일 프로젝트 (5d)</p>
                      <p className="text-xl font-black text-white">{(trueDailyRate * 5).toLocaleString()} 원</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleCopy}
                className="w-full bg-white text-slate-900 hover:bg-slate-200 transition-colors font-black py-5 rounded-2xl text-lg shadow-xl shadow-white/10 flex items-center justify-center gap-2 active:scale-95"
              >
                {copied ? "클립보드 복사 완료! ✅" : "외주 견적 산정 근거 텍스트로 브리핑 복사하기"}
              </button>

              </div>
              {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-center space-y-4 p-8 bg-slate-800/80 backdrop-blur-md rounded-[32px] border border-white/10 shadow-2xl mx-4 w-full max-w-sm">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 mb-2">
                        <Lock className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-black text-white tracking-tight">당신의 진짜 시급이 계산되었습니다</h4>
                      <p className="text-slate-400 font-medium text-sm leading-relaxed">충격적인 진실을 마주할 준비가 되셨나요?</p>
                      <button onClick={() => setIsModalOpen(true)} className="mt-4 w-full bg-rose-500 text-white font-black py-4 rounded-xl shadow-xl shadow-rose-500/20 hover:scale-105 transition-transform text-base flex items-center justify-center gap-2">
                        10초 광고 보고 결과 확인하기
                      </button>
                    </div>
                  </div>
              )}
            </div>
          </div>
          <AdModal isOpen={isModalOpen} onComplete={() => { setIsUnlocked(true); setIsModalOpen(false); }} />

        </div>

      </div>
    </div>
  );
}
