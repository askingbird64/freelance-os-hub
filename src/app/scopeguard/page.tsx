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
      good: `안녕하세요 ${clientName}님,\n\n전달해주신 [${projectName}] 수정 피드백 잘 확인했습니다!\n\n현재 계약서상 배정된 무상 수정 횟수(ex. 2회)가 모두 소진된 상태입니다. 이번 피드백까지는 서비스 차원에서 진행해 드리겠습니다만, 이후 발생하는 추가 수정 건에 대해서는 1회당 ${extraInput}의 추가 비용이 발생할 수 있는 점 미리 안내해 드립니다.\n\n이번 수정본도 꼼꼼히 잡아서 완성도 있게 전달드리겠습니다. 감사합니다!\n\n${myName} 드림`,
      bad: `안녕하세요 ${clientName}님,\n\n요청하신 [${projectName}] 추가 수정 사항 확인했습니다.\n계약서 제 O항에 명시된 바와 같이, 무상 수정 횟수가 초과되었으므로 금번 수정부터는 추가 청구가 필요합니다.\n\n이번 수정 비용은 ${extraInput}으로 산정되며, 해당 금액에 대한 결제(또는 합의)가 완료된 후 작업에 착수할 수 있습니다. 추가 결제를 원치 않으실 경우 현재 버전을 최종본으로 확정하여 납품하겠습니다.\n\n어떻게 진행할지 회신 부탁드립니다. 감사합니다.\n\n${myName} 드림`
    },
    scope: {
      good: `안녕하세요 ${clientName}님,\n\n말씀하신 [${projectName}]의 추가 업무 요건 잘 읽어보았습니다. 좋은 아이디어인 것 같습니다!\n\n다만, 해당 내용은 초기 계약된 업무 범위(SOW)에 포함되지 않아 제 작업 일정과 리소스가 추가로 투입되어야 합니다. 요청하신 업무를 추가하기 위해서는 약 ${extraInput}의 견적 조정과 N일의 일정 연장이 필요할 것 같습니다.\n\n기존 범위대로 먼저 마무리할지, 아니면 견적을 추가하고 함께 진행할지 편하신 방향으로 말씀해 주시면 감사하겠습니다.\n\n${myName} 드림`,
      bad: `안녕하세요 ${clientName}님,\n\n추가 요청해주신 사항 확인했습니다.\n해당 업무는 당초 합의된 [${projectName}] 계약 범위에 포함되지 않은 '신규 과업'이므로 현재 스케줄 내에서 무상으로 진행하기 어렵습니다.\n\n추가 진행을 원하실 경우, 기존 계약과 별개의 추가 계약서(견적: ${extraInput})를 작성해야 합니다. 현재 리소스 확보가 어려울 수 있으니, 우선 기존 계약된 범위의 납품을 마친 후 추가 업무에 대해 논의하는 것을 제안 드립니다.\n\n감사합니다.\n\n${myName} 드림`
    },
    payment: {
      good: `안녕하세요 ${clientName}님,\n\n그동안 평안하셨는지요? 다름이 아니오라 [${projectName}] 관련하여 잔금 처리가 되지 않은 것 같아 리마인드 차 연락드렸습니다.\n\n혹시 내부 회계 처리 과정에서 누락되었거나 계산서 재발행이 필요한 경우 언제든 말씀해 주시기 바랍니다. 바쁘시겠지만 확인 후 입금 처리해 주시면 정말 감사하겠습니다.\n\n환절기 건강 유의하세요!\n\n${myName} 드림`,
      bad: `[중요] ${clientName} - [${projectName}] 대금 지연에 따른 결제 촉구의 건\n\n안녕하세요.\n금일 기준으로 [${projectName}] 계약의 결제 기일이 지났으나 아직 대금이 입금되지 않아 부득이하게 연락드립니다.\n\n계약서에 명시된 바와 같이 대금 지급이 지속 지연될 경우 지연 이자가 청구될 수 있으며, 잔금 미결제 시 납품된 제작물의 저작권 및 사용권은 당사에 귀속되어 상업적 사용이 제한됩니다.\n\n본 메일 수신 후 3영업일 이내에 ${extraInput} 계좌로 결제를 완료해 주시기를 강력히 요청합니다.\n\n${myName} 드림`
    },
    source: {
      good: `안녕하세요 ${clientName}님,\n\n[${projectName}] 프로젝트 작업물 원본 파일(PSD/AEP 등)을 요청해 주셔서 확인했습니다.\n\n본 계약은 '최종 결과물 배포 (렌더링본)'에 대한 사용권 계약으로, 작업 원본 파일의 소유권과 제공은 계약 범위에 포함되지 않았습니다. 원본 파일에는 제 작업 노하우와 커스텀 에셋들이 포함되어 있어 기본적으로 제공이 어렵습니다.\n\n다만, 내부 편집 등 꼭 필요한 사유가 있으실 경우, 원본 파일 양도 비용(${extraInput})을 별도로 책정하여 넘겨드리는 방안이 있으니 긍정적으로 검토 부탁드립니다.\n\n${myName} 드림`,
      bad: `안녕하세요 ${clientName}님,\n\n[${projectName}] 원본 프로젝트 파일은 창작자의 작업 구조와 소스 데이터가 포함된 핵심 지식재산권이며, 이를 무단으로 수정하거나 타 프로젝트에 재사용하는 것을 방지하기 위해 원칙적으로 양도하지 않습니다.\n\n계약서에 명기된 최종 산출물 외의 원본 파일(레이어가 살아있는 디자인/영상 파일) 제공은 명백한 계약 외 요구사항입니다. 원본 파일을 타인에게 넘기거나 내부에서 2차 가공하실 경우 별도의 '2차적 저작물 작성권' 합의 및 원본 구매(${extraInput})가 선행되어야 함을 안내드립니다.\n\n감사합니다.\n\n${myName} 드림`
    },
    weekend: {
      good: `안녕하세요 ${clientName}님!\n\n전해주신 [${projectName}] 관련 메시지 확인했습니다. 꼼꼼히 피드백 챙겨주셔서 감사합니다.\n\n다만 현재가 주말(휴일/심야)인 관계로 당장 PC 앞에서 작업과 확인을 진행하기가 다소 어렵습니다. 남겨주신 내용은 제가 잘 갈무리해 두었다가, 다가오는 평일 업무 시간(${extraInput})에 가장 먼저 확인하고 처리 후 회신 드리도록 하겠습니다.\n\n편안한 주말/저녁 보내시길 바랍니다!\n\n${myName} 드림`,
      bad: `안녕하세요 ${clientName}님,\n\n연락 주신 사항 확인했습니다만, 현재는 정규 업무 시간이 아니므로 즉각적인 대응 및 피드백 수정이 불가능합니다.\n\n프리랜서 계약 시 사전 합의된 저의 정규 업무 시간은 [${extraInput}]입니다. 업무 외 시간의 과도한 연락 및 주말 작업 지시는 업무 효율을 떨어뜨릴 뿐만 아니라 상호 조율되지 않은 무리한 요구입니다.\n\n전달해주신 내용은 다음 영업일에 확인하여 순차적으로 답변드리겠습니다. 앞으로 가급적 업무 시간 내에 소통해 주시기를 정중히 부탁드립니다.\n\n${myName} 드림`
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
                    😊 부드럽게 넘어가기 (Good Cop)
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
                    ⛔ 단호하게 선 긋기 (Bad Cop)
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
