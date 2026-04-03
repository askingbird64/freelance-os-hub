"use client";

import { useState } from "react";
import AdModal from "../../components/AdModal";
import { Lock } from "lucide-react";

type Category = 'revision' | 'scope' | 'payment' | 'source' | 'weekend';

export default function ScopeGuard() {
  const [category, setCategory] = useState<Category>('revision');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pendingCopy, setPendingCopy] = useState<{text: string, type: 'good' | 'bad'} | null>(null);
  
  const [clientName, setClientName] = useState("클라이언트");
  const [projectName, setProjectName] = useState("프로젝트");
  const [myName, setMyName] = useState("프리랜서");
  const [extraInput, setExtraInput] = useState("100,000원"); // 추가금 등 상황별 변수

  const [copiedType, setCopiedType] = useState<'good' | 'bad' | null>(null);

  const categories = [
    { id: 'revision', label: '무한 수정 요구 방어', icon: '🔁' },
    { id: 'scope', label: '갑작스러운 업무 추가', icon: '📝' },
    { id: 'payment', label: '결제(잔금) 지연', icon: '💸' },
    { id: 'source', label: '무료 원본 파일(PSD/AEP) 요구', icon: '🗂️' },
    { id: 'weekend', label: '심야/주말 연락 커트', icon: '🌙' },
  ];

  const templates = {
    revision: {
      good: `안녕하세요 ${clientName}님,\n\n보내주신 [${projectName}] 피드백 내용 확인했습니다.\n\n다만, 사전에 협의된 무상 수정 횟수가 모두 소진되어 안내 말씀 드립니다. 이번 수정 요청 건까지는 무상으로 진행해 드리겠습니다만, 이후 발생하는 추가 수정에 대해서는 1회당 ${extraInput}의 비용이 발생하게 됩니다.\n\n말씀해주신 내용은 꼼꼼히 반영하여 작업 후 전달드리겠습니다. 감사합니다.\n\n${myName} 드림`,
      bad: `안녕하세요 ${clientName}님,\n\n요청하신 [${projectName}] 추가 수정 사항 확인했습니다.\n\n계약서에 명시된 무상 수정 횟수가 이미 초과되었으므로, 금번 요청사항부터는 과업 변경에 따른 추가 비용이 청구됩니다.\n\n이번 수정 비용은 ${extraInput}으로 산정되며, 해당 금액에 대한 결제가 완료된 후 작업에 착수할 수 있습니다. 추가 비용 지불이 어려우신 경우, 이전 작업물을 최종본으로 납품하게 됩니다.\n\n어떻게 진행할지 내부 논의 후 회신 부탁드립니다.\n\n${myName} 드림`
    },
    scope: {
      good: `안녕하세요 ${clientName}님,\n\n새로 제안해주신 [${projectName}]의 추가 업무 내용은 잘 확인했습니다.\n\n다만, 해당 내용은 초기 계약 내용 및 과업 지시서(SOW)에 포함되지 않은 내용이라 제 일정과 작업 리소스가 추가로 필요한 상황입니다. 이를 모두 반영하여 진행할 경우, 약 ${extraInput}의 추가 견적과 N일의 일정 연장이 불가피합니다.\n\n기존 범위 안에서 일정을 맞추어 먼저 마무리할지, 아니면 일정을 연장하고 추가 견적을 반영하여 함께 진행할지 편하신 방향으로 말씀해 주시면 감사하겠습니다.\n\n${myName} 드림`,
      bad: `안녕하세요 ${clientName}님,\n\n추가로 요청해주신 사항 확인했습니다.\n\n해당 내용은 당초 합의된 [${projectName}] 계약 과업 범위에 포함되지 않은 신규 과업이므로, 현재 일정 및 비용 내에서 무상으로 진행해 드리기는 어렵습니다.\n\n추가 진행을 원하실 경우, 기존 계약과 별도의 추가 계약서(견적: ${extraInput}) 작성이 필요합니다. 현재 제 스케줄상 즉각적인 리소스 투입이 어려울 수 있으니, 우선 기존 계약된 범위의 납품을 정상적으로 마친 후 추가 업무 진행 여부를 논의하는 것을 제안 드립니다.\n\n감사합니다.\n\n${myName} 드림`
    },
    payment: {
      good: `안녕하세요 ${clientName}님,\n\n[${projectName}] 프로젝트 대금 결제와 관련하여 확인 차 연락드립니다.\n\n기존에 합의된 결제 기한이 지났으나 아직 입금이 확인되지 않아 메일 드립니다. 혹시 내부 회계 처리 과정에서 누락되었거나 계산서 재발행 등 필요한 조치가 있다면 편하게 말씀해 주시기 바랍니다.\n\n바쁘시겠지만 확인 후 조속한 입금 처리 부탁드리겠습니다. 감사합니다.\n\n${myName} 드림`,
      bad: `[중요] ${clientName} - [${projectName}] 대금 지연에 따른 결제 촉구의 건\n\n안녕하세요.\n\n금일 기준으로 [${projectName}] 계약의 대금 결제 기한이 경과되었으나, 아직까지 입금이 확인되지 않아 부득이하게 연락드립니다.\n\n계약서에 명시된 바와 같이, 대금 지급이 지속적으로 지연될 경우 지연 이자가 청구될 수 있습니다. 또한, 잔금이 완납되지 않은 상태에서는 납품된 결과물의 저작권 및 사용권이 양도되지 않으므로 상업적 사용이 제한됩니다.\n\n본 메일을 수신하신 후 3영업일 이내에 지정된 계좌(${extraInput})로 결제를 완료해 주시기를 강력히 요청합니다.\n\n${myName} 드림`
    },
    source: {
      good: `안녕하세요 ${clientName}님,\n\n[${projectName}] 프로젝트의 원본 파일(PSD/AEP 등)을 요청해 주셔서 내용 확인했습니다.\n\n본 계약은 '최종 산출물(렌더링 등)'에 대한 납품 및 사용권 계약으로, 작업 원본 파일의 소유권 이전 및 제공은 애초 계약 범위에 포함되어 있지 않습니다.\n\n만일 내부 편집이나 2차 가공 등 원본 파일이 반드시 필요한 상황이시라면, 원본 소스 양도 비용(${extraInput})을 별도로 책정하여 제공해 드리고 있으니, 내부 검토 후 말씀해 주시면 감사하겠습니다.\n\n${myName} 드림`,
      bad: `안녕하세요 ${clientName}님,\n\n요청하신 [${projectName}] 원본 프로젝트 파일은 창작자의 작업 노하우와 커스텀 소스가 포함된 지식재산권이며, 원칙적으로 양도 및 제공을 엄격히 제한하고 있습니다.\n\n계약서에 명시된 최종 산출물 외에 레이어가 살아있는 원본 파일(디자인/영상 파일 등)의 제공은 명백한 계약 범위를 벗어나는 요구사항입니다. 원본 파일을 타인에게 넘기거나 내부에서 2차 가공을 진행하실 경우, 별도의 '2차적 저작물 작성권' 합의 및 원본 구매 비용(${extraInput}) 지불이 선행되어야 함을 안내해 드립니다.\n\n감사합니다.\n\n${myName} 드림`
    },
    weekend: {
      good: `안녕하세요 ${clientName}님,\n\n보내주신 [${projectName}] 관련 메시지는 잘 확인했습니다. 공유해 주셔서 감사합니다.\n\n다만 현재가 정규 업무 시간이 아닌 주말/공휴일(또는 심야 시간)이라, 즉각적인 내용 확인이나 작업 진행이 어려운 점 양해 부탁드립니다. 남겨주신 내용은 잘 확인해 두었다가 평일 업무 시간(${extraInput})에 복귀하는 대로 가장 먼저 처리하여 회신 드리도록 하겠습니다.\n\n편안한 휴일/저녁 보내시길 바랍니다. 감사합니다.\n\n${myName} 드림`,
      bad: `안녕하세요 ${clientName}님,\n\n연락 주신 사항은 확인했습니다만, 현재는 합의된 업무 시간이 아니므로 즉각적인 답변이나 피드백 반영이 불가능합니다.\n\n당초 프리랜서 계약 시 사전에 합의된 저의 정규 업무 시간은 [${extraInput}]입니다. 업무 외 시간이나 주말에 급한 작업 지시를 주시는 것은 사전 조율되지 않은 무리한 스케줄 요구이며, 전반적인 업무 효율과 품질에도 악영향을 미칠 수 있습니다.\n\n전달해주신 내용은 다음 영업일에 확인 후 순위대로 처리하여 답변드리겠습니다. 앞으로는 가급적 정해진 업무 시간 내에 연락 주시기를 정중하게 당부드립니다.\n\n${myName} 드림`
    }
  };

  const handleCopyClick = (text: string, type: 'good' | 'bad') => {
    const isPremium = false; // TODO: Check local storage for JWT premium ticket
    if (isPremium) {
      executeCopy(text, type);
    } else {
      setPendingCopy({ text, type });
      setIsModalOpen(true);
    }
  };

  const executeCopy = (text: string, type: 'good' | 'bad') => {
    setIsUnlocked(true);
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setIsModalOpen(false);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col px-4 py-8 md:p-12 font-sans text-slate-800">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full mb-8">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.png" alt="ScopeGuard Logo" className="w-14 h-14 rounded-2xl shadow-lg shadow-indigo-500/20 border-2 border-indigo-200" />
          <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-sm border border-indigo-200 tracking-widest shadow-sm">HANWOOLMAN 제작</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
          ScopeGuard <span className="text-xl px-3 py-1 bg-indigo-600 text-white rounded-full">MVP</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium">프리랜서를 구하는 무상태(Stateless) 단호박 이메일 생성기. 감정을 다치지 않고 선을 긋는 법.</p>
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input Form */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-8 sticky top-8">
          
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">1. 어떤 상황인가요?</h2>
            <div className="space-y-2">
               {categories.map(c => (
                 <button 
                  key={c.id} 
                  onClick={() => setCategory(c.id as Category)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all border ${
                    category === c.id ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                 >
                   <span className="mr-2">{c.icon}</span> {c.label}
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">2. 기본 정보 입력</h2>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">상대방 (클라이언트) 이름</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">프로젝트 명</label>
              <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">내 이름 (프리랜서)</label>
              <input type="text" value={myName} onChange={e => setMyName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-rose-500 block mb-1">상황별 변수 (금액/시간/계좌 등)</label>
              <input type="text" value={extraInput} onChange={e => setExtraInput(e.target.value)} className="w-full bg-rose-50 border border-rose-200 text-rose-900 rounded-lg px-3 py-2 text-sm font-black focus:ring-2 focus:ring-rose-500 outline-none transition-all" />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">추가금 청구시 금액, 주말락시 나의 평일 근무시간 등을 적으세요.</p>
            </div>
          </div>
        </div>

        {/* Right: Outputs */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* GOOD COP */}
          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden relative group transition-all hover:shadow-md">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-400"></div>
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tight text-emerald-900 flex items-center gap-2">
                    ✅ 정중하게 방어하기
                  </h3>
                  <p className="text-sm font-bold text-emerald-600/70 mt-1">
                    관계 유지가 중요하지만, 내 권리는 부드럽게 지켜야 할 때 (1차 방어용)
                  </p>
                </div>
                <button 
                  onClick={() => handleCopyClick(templates[category].good, 'good')}
                  className={`shrink-0 px-4 py-2 text-sm font-bold rounded-lg transition-all ${copiedType === 'good' ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                >
                  {copiedType === 'good' ? '복사 완료! ✅' : '클립보드 복사'}
                </button>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden group">
                 <div className={`transition-all duration-500 ${!isUnlocked ? 'blur-[8px] select-none opacity-40' : ''}`}>
                   <p className="whitespace-pre-wrap text-slate-700 leading-loose font-medium text-[15px]">
                     {templates[category].good}
                   </p>
                 </div>
                 {!isUnlocked && (
                   <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/10 backdrop-blur-[2px]">
                     <button onClick={() => { setPendingCopy({text: templates[category].good, type: 'good'}); setIsModalOpen(true); }} className="bg-slate-900 text-white font-black px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 hover:scale-105 transition-transform text-sm">
                       <Lock className="w-4 h-4 text-emerald-400" /> 10초 대기 후 원문 잠금 해제
                     </button>
                   </div>
                 )}
              </div>
            </div>
          </div>

          {/* BAD COP */}
          <div className="bg-white rounded-3xl shadow-sm border border-rose-100 overflow-hidden relative group transition-all hover:shadow-md">
             <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
             <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tight text-rose-900 flex items-center gap-2">
                    ⛔ 단호하게 거절하기
                  </h3>
                  <p className="text-sm font-bold text-rose-600/70 mt-1">
                    도가 지나친 요구를 법적, 계약적 근거로 단호하게 쳐내야 할 때 (최후 통첩용)
                  </p>
                </div>
                <button 
                  onClick={() => handleCopyClick(templates[category].bad, 'bad')}
                  className={`shrink-0 px-4 py-2 text-sm font-bold rounded-lg transition-all ${copiedType === 'bad' ? 'bg-rose-500 text-white shadow-md' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
                >
                   {copiedType === 'bad' ? '복사 완료! ✅' : '클립보드 복사'}
                </button>
              </div>
              <div className="bg-rose-50/30 p-6 rounded-2xl border border-rose-50 relative overflow-hidden group">
                 <div className={`transition-all duration-500 ${!isUnlocked ? 'blur-[8px] select-none opacity-40' : ''}`}>
                   <p className="whitespace-pre-wrap text-slate-800 leading-loose font-bold text-[15px]">
                     {templates[category].bad}
                   </p>
                 </div>
                 {!isUnlocked && (
                   <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/10 backdrop-blur-[2px]">
                     <button onClick={() => { setPendingCopy({text: templates[category].bad, type: 'bad'}); setIsModalOpen(true); }} className="bg-slate-900 text-white font-black px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 hover:scale-105 transition-transform text-sm">
                       <Lock className="w-4 h-4 text-rose-400" /> 10초 대기 후 원문 잠금 해제
                     </button>
                   </div>
                 )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Global Ad Modal for Freemium Friction */}
      <AdModal 
        isOpen={isModalOpen} 
        onComplete={() => {
          if (pendingCopy) executeCopy(pendingCopy.text, pendingCopy.type);
        }} 
      />
    </div>
  );
}
