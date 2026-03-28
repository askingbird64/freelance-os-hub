export default function AdBanner() {
  return (
    <div className="w-full bg-slate-100 border-b border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[90px] text-center p-2 isolate relative z-50">
      <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-0.5 rounded shadow-sm mb-1 uppercase tracking-widest border border-slate-200">
        Advertisement Space
      </span>
      <p className="text-slate-500 font-bold text-xs tracking-tight">
        이곳에 구글 애드센스(Google AdSense) 상단 띠배너 광고가 무조건 노출됩니다.
      </p>
    </div>
  );
}
