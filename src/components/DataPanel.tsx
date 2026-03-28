import { AppState } from "@/types";
import { useState } from "react";

export default function DataPanel({ state }: { state: AppState }) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (id: number, text: string) => {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = () => {
    if (state.rawContents.length === 0) return;
    const textContent = state.rawContents.map(c => `[${c.subreddit}] ${c.url}\n${c.rawText}\n`).join("\n---\n\n");
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reddit_raw_data_feed.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentLog = state.logs[state.logs.length - 1] || "Waiting for signal...";

  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full overflow-hidden">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-700 p-1.5 rounded-lg">📄</span>
            Raw Data Feed
        </div>
        <div className="flex items-center gap-2">
            {state.rawContents.length > 0 && (
                <button 
                  onClick={handleDownloadTxt} 
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold rounded shadow-sm transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  현재수집본 TXT
                </button>
            )}
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 py-1 px-2 rounded-lg transition-all">
                {state.rawContents.length} items collected
            </span>
        </div>
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {state.rawContents.length === 0 && state.status !== "CRAWLING" && state.status !== "IDLE" && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <p className="text-sm">No data collected yet.</p>
            </div>
        )}

        {/* Live crawling log feedback */}
        {state.status === "CRAWLING" && (
            <div className="sticky top-0 z-10 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-[11px] font-bold flex items-center gap-3 shadow-sm">
                <svg className="animate-spin h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <div className="flex-1 truncate leading-relaxed">{currentLog}</div>
            </div>
        )}

        {state.rawContents.map((content) => (
            <div key={content.id} className="p-4 border border-slate-100 bg-slate-50 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-300 group-hover:bg-amber-400 transition-colors"></div>
                <div className="flex justify-between items-center mb-2 gap-2">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded break-all">{content.subreddit}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{content.sourceType}</span>
                    </span>
                    <div className="flex flex-shrink-0 items-center gap-2">
                        <button 
                            onClick={() => handleCopy(content.id, content.rawText)}
                            className="text-[10px] font-medium transition-colors flex items-center gap-1 hover:bg-slate-200 px-1.5 py-1 rounded"
                            style={{ color: copiedId === content.id ? '#10b981' : '#64748b' }}
                        >
                            {copiedId === content.id ? (
                                <>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span>복사됨!</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    <span>내용 복사</span>
                                </>
                            )}
                        </button>
                        <a href={content.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1 hover:bg-blue-50 px-1.5 py-1 rounded transition-colors">
                            <span>원본 링크</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                    </div>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed font-medium mt-2 whitespace-pre-wrap">
                    {content.rawText}
                </p>
            </div>
        ))}
      </div>
    </div>
  );
}
