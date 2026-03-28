"use client";

import { useState, useEffect, Suspense, KeyboardEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import AdModal from "../../components/AdModal";
import { Lock } from "lucide-react";

function TimeSyncApp() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('d');

  // Creator State
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [title, setTitle] = useState("");
  
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmpm] = useState<'AM'|'PM'>('AM');

  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Viewer State
  const [viewerData, setViewerData] = useState<{ title: string, timestamp: number, lang?: 'ko'|'en' } | null>(null);
  const [viewerTimezone, setViewerTimezone] = useState("");

  const t = {
    ko: {
      titleLabel: "미팅 제목", titlePlaceholder: "예: 프로젝트 킥오프",
      dateLabel: "날짜 (앞에 0을 안 붙여도 됩니다)",
      timeLabel: "시간 (24시간제)",
      yearP: "년", monthP: "월", dayP: "일",
      hourP: "시", minP: "분", am: "오전", pm: "오후",
      btnGenerate: "🚀 마법의 링크 생성하기",
      success: "DB 저장 없이 URL 파라미터로 압축 생성 완료!",
      copy: "복사", copied: "복사됨!",
      instruction: "이 링크를 해외 클라이언트에게 전달하면, 클릭하는 순간 상대방의 현지 시각(타임존)으로 자동 변환되어 보여집니다!",
      preview: "실시간 시간 해석 미리보기:",
      viewerTitle: "초대장이 도착했습니다 💌",
      viewerLocal: "당신의 현지 시간 기준",
      calendar: "🗓️ 구글 캘린더에 추가하기",
      makeOwn: "나도 타임존 변환 링크 만들기"
    },
    en: {
      titleLabel: "Meeting Title", titlePlaceholder: "e.g. Project Sync",
      dateLabel: "Date (No Need for Leading Zeros)",
      timeLabel: "Time (24-Hour Base)",
      yearP: "Y", monthP: "M", dayP: "D",
      hourP: "H", minP: "M", am: "AM", pm: "PM",
      btnGenerate: "🚀 Generate Magic Link",
      success: "Stateless Universal Link Generated!",
      copy: "Copy", copied: "Copied!",
      instruction: "Send this link to an international client. When clicked, it instantly converts the meeting time to THEIR exact local timezone!",
      preview: "Real-time Live Preview:",
      viewerTitle: "You have a meeting invite 💌",
      viewerLocal: "IN YOUR LOCAL TIMEZONE",
      calendar: "🗓️ Add to Google Calendar",
      makeOwn: "Create your own TimeSync Link"
    }
  };

  useEffect(() => {
    setViewerTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    if (dataParam) {
      try {
        const decodedStr = atob(dataParam);
        const parsed = JSON.parse(decodedStr);
        setViewerData(parsed);
        if (parsed.lang === 'en') setLang('en');
      } catch (e) {
        console.error("Invalid link");
      }
    }

    const today = new Date();
    if (!year) setYear(today.getFullYear().toString());
  }, []);

  const getComputedTimestamp = () => {
    if (!year || !month || !day || !hour || !minute) return NaN;
    
    let h = parseInt(hour, 10);
    
    // 1글자 입력 시에만 오전/오후 토글 스위치 값을 반영하여 24시간제로 치환
    if (hour.length === 1) {
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
    }
    // 2글자 입력 시에는 이미 명확한 24시간제(예: 14, 09 등)이므로 입력된 h값을 그대로 사용

    const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const timeStr = `${String(h).padStart(2, '0')}:${minute.padStart(2, '0')}`;
    const temp = new Date(`${dateStr}T${timeStr}`);
    
    return temp.getTime();
  };

  const handleGenerateClick = () => {
    if (!title || isNaN(getComputedTimestamp())) return;
    setIsModalOpen(true);
  };

  const handleGenerate = () => {
    setIsModalOpen(false);
    if (!title) return;
    const ts = getComputedTimestamp();
    if (isNaN(ts)) return;

    const payload = {
      title,
      timestamp: ts,
      lang
    };

    const encoded = btoa(JSON.stringify(payload));
    const link = `${window.location.origin}/timesync?d=${encoded}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGoogleCalendarLink = (title: string, timestamp: number) => {
    const startDate = new Date(timestamp);
    const endDate = new Date(timestamp + 60 * 60 * 1000);
    const formatStr = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatStr(startDate)}/${formatStr(endDate)}&details=Generated%20by%20TimeSync`;
  };

  const handleNext = (e: KeyboardEvent<HTMLInputElement>, nextId: string | null) => {
    if (e.key === 'Enter' || e.key === 'ArrowRight') {
      const target = e.currentTarget;
      if (e.key === 'ArrowRight' && target.selectionEnd !== target.value.length) return;
      e.preventDefault();
      
      if (nextId) document.getElementById(nextId)?.focus();
      else if (hour.length === 1) { /* 1글자일땐 시간 토글이 남았으므로 통과옵션 처리할수도있으나 기본적으론 패스 */ }
      else handleGenerateClick(); 
    }
  };

  const handleNumberInput = (setter: (val: string) => void, maxLen: number, nextId?: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > maxLen) val = val.slice(0, maxLen);
    setter(val);
    if (val.length === maxLen && nextId) {
      setTimeout(() => document.getElementById(nextId)?.focus(), 50);
    }
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    
    setHour(val);

    // 자동 로직: 1글자일 경우 기본 [오전] 세팅, 2글자일 경우 숫자에 따라 자동 감지
    if (val.length === 1) {
      setAmpm('AM');
    } else if (val.length === 2) {
      const h = parseInt(val, 10);
      if (h >= 12) setAmpm('PM'); // 12 이상이면 오후
      else setAmpm('AM'); // 11 이하면 오전
      
      // 2글자가 모두 입력되면 자동으로 분(minute) 컨트롤로 이동
      setTimeout(() => document.getElementById('minute')?.focus(), 50);
    }
  };

  const txt = t[lang];
  const ts = getComputedTimestamp();
  const previewDateObj = isNaN(ts) ? null : new Date(ts);

  // 1글자일 때만 활성화
  const isAmpmActive = hour.length === 1;

  if (viewerData) {
    const meetingDate = new Date(viewerData.timestamp);
    
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 font-sans">
        
        <div className="absolute top-6 right-8 flex gap-2 bg-white px-2 py-1 rounded-full shadow-sm border border-slate-200">
          <button onClick={() => setLang('ko')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'ko' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>ko</button>
          <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'en' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>en</button>
        </div>

        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-indigo-100 p-8 text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="space-y-2">
            <div className="inline-block bg-indigo-50 text-indigo-600 font-bold px-4 py-1.5 rounded-full text-sm mb-4">
               {txt.viewerTitle}
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{viewerData.title}</h1>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-2">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{txt.viewerLocal}</p>
            <p className="text-4xl font-black text-indigo-600 tracking-tighter">
               {meetingDate.toLocaleTimeString(lang === 'ko' ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-lg font-bold text-slate-700">
               {meetingDate.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-xs font-bold">
               🌐 {viewerTimezone}
            </div>
          </div>

          <a 
            href={getGoogleCalendarLink(viewerData.title, viewerData.timestamp)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
          >
            {txt.calendar}
          </a>

          <a href="/" className="block text-sm font-bold text-slate-400 hover:text-indigo-500 underline underline-offset-4 pt-4 border-t border-slate-100">
            {txt.makeOwn}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 font-sans">
      
      <div className="absolute top-6 right-8 flex gap-2 bg-white px-2 py-1 rounded-full shadow-sm border border-slate-200">
        <button onClick={() => setLang('ko')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'ko' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>ko</button>
        <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'en' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>en</button>
      </div>

      <div className="max-w-xl w-full space-y-8">
        
        <div className="text-center space-y-4">
          <img src="/logo.png" alt="TimeSync Logo" className="w-16 h-16 rounded-2xl shadow-lg shadow-cyan-500/20 border-2 border-cyan-200 mx-auto mb-2" />
          <h1 className="text-5xl font-black text-slate-900 tracking-tight flex flex-col md:flex-row items-center justify-center gap-4">
            <div>TimeSync <span className="text-cyan-600 text-3xl align-top">MVP</span></div>
            <span className="text-xs font-bold bg-cyan-100 text-cyan-800 px-3 py-1 rounded-sm border border-cyan-200 tracking-widest shadow-sm">HANWOOLMAN 제작</span>
          </h1>
          <p className="text-base font-medium text-slate-500 leading-relaxed">
            Stateless Cloudflare Optimized Edge Tool<br/>
            회의 링크 하나로 해외 클라이언트와 시차 혼동 없이 미팅을 잡으세요.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{txt.titleLabel}</label>
              <input 
                id="title"
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => handleNext(e, 'month')}
                autoFocus
                placeholder={txt.titlePlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            
            {/* 날짜 분할 입력 시스템 */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{txt.dateLabel}</label>
              <div className="flex gap-3">
                <div className="flex-[2] flex items-center bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  <input id="year" value={year} onChange={handleNumberInput(setYear, 4, 'month')} onKeyDown={e => handleNext(e, 'month')} placeholder="2023" className="w-full bg-transparent py-3 text-center text-xl font-black text-indigo-900 placeholder-indigo-200 outline-none" />
                  <span className="text-indigo-400 font-bold ml-1 select-none">{txt.yearP}</span>
                </div>
                <div className="flex-1 flex items-center bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  <input id="month" value={month} onChange={handleNumberInput(setMonth, 2, 'day')} onKeyDown={e => handleNext(e, 'day')} placeholder="11" className="w-full bg-transparent py-3 text-center text-xl font-black text-indigo-900 placeholder-indigo-200 outline-none" />
                  <span className="text-indigo-400 font-bold ml-1 select-none">{txt.monthP}</span>
                </div>
                <div className="flex-1 flex items-center bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  <input id="day" value={day} onChange={handleNumberInput(setDay, 2, 'hour')} onKeyDown={e => handleNext(e, 'hour')} placeholder="1" className="w-full bg-transparent py-3 text-center text-xl font-black text-indigo-900 placeholder-indigo-200 outline-none" />
                  <span className="text-indigo-400 font-bold ml-1 select-none">{txt.dayP}</span>
                </div>
              </div>
            </div>

            {/* 시간 입력 시스템 (24시간 인지형) */}
            <div className="border-t border-slate-100 pt-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">{txt.timeLabel}</label>
              <div className="flex gap-3 items-center">
                <div className="flex-[2] flex items-center bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  <input id="hour" value={hour} onChange={handleHourChange} onKeyDown={e => handleNext(e, 'minute')} placeholder="3" className="w-full bg-transparent py-3 text-center text-xl font-black text-indigo-900 placeholder-indigo-200 outline-none" />
                  <span className="text-indigo-400 font-bold ml-1 select-none">{txt.hourP}</span>
                </div>
                <div className="flex-[2] flex items-center bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  <input id="minute" value={minute} onChange={handleNumberInput(setMinute, 2)} onKeyDown={e => handleNext(e, null)} placeholder="00" className="w-full bg-transparent py-3 text-center text-xl font-black text-indigo-900 placeholder-indigo-200 outline-none" />
                  <span className="text-indigo-400 font-bold ml-1 select-none">{txt.minP}</span>
                </div>
                
                {/* 오전 / 오후 (AM / PM) 토글 (동적 활성화) */}
                <div className={`flex flex-col bg-slate-100 p-1.5 rounded-xl shrink-0 transition-opacity duration-300 ${isAmpmActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <button 
                    onClick={() => setAmpm('AM')} 
                    disabled={!isAmpmActive}
                    className={`px-4 py-1.5 text-xs font-black rounded-md transition-all ${ampm === 'AM' && isAmpmActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'}`}
                  >
                    {txt.am}
                  </button>
                  <button 
                    onClick={() => setAmpm('PM')} 
                    disabled={!isAmpmActive}
                    className={`px-4 py-1.5 text-xs font-black rounded-md transition-all ${ampm === 'PM' && isAmpmActive ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'}`}
                  >
                    {txt.pm}
                  </button>
                </div>
              </div>
            </div>

            {/* 실시간 미리보기 */}
            {previewDateObj && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-center animate-in zoom-in-95 mt-4">
                 <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">{txt.preview}</p>
                 <p className="text-2xl font-black text-indigo-900 tracking-tighter">
                    {previewDateObj.toLocaleTimeString(lang === 'ko' ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                 </p>
                 <p className="text-sm font-bold text-indigo-700 mt-1">
                    {previewDateObj.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </p>
              </div>
            )}

            <div className="pt-2">
              <button 
                onClick={handleGenerateClick}
                disabled={!title || !previewDateObj}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 active:scale-95 text-lg flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5 text-indigo-400" />
                {txt.btnGenerate}
              </button>
            </div>
          </div>

          {generatedLink && (
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {txt.success}
              </p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={generatedLink}
                  readOnly
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 outline-none"
                />
                <button 
                  onClick={copyToClipboard}
                  className={`px-6 rounded-lg font-bold text-white transition-all ${
                    copied ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {copied ? txt.copied : txt.copy}
                </button>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {txt.instruction}
              </p>
            </div>
          )}
        </div>

      </div>
      <AdModal isOpen={isModalOpen} onComplete={handleGenerate} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-bold text-slate-400">Loading TimeSync...</div>}>
      <TimeSyncApp />
    </Suspense>
  );
}
