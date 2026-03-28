import { AppState, PainCluster } from "@/types";
import { useState } from "react";

export default function AnalysisPanel({ state }: { state: AppState }) {
  const [activeExport, setActiveExport] = useState<string>("JSON");

  const exportData = state.exports.find(e => e.type === activeExport);

  const handleDownloadTxt = () => {
    if (state.rawContents.length === 0) return;
    const textContent = state.rawContents.map(c => `[${c.subreddit}] ${c.url}\n${c.rawText}\n`).join("\n---\n\n");
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reddit_raw_data_${state.config?.mainKeyword || "export"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">🧠</span>
          Pain Insights
        </h2>
        
        {state.exports.length > 0 && (
            <div className="flex gap-2 items-center">
              <button 
                  onClick={handleDownloadTxt}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  전체 원본 TXT 다운로드
              </button>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {["JSON", "MARKDOWN", "CHATBOT_PROMPT", "ANTIGRAVITY_PROMPT"].map(type => (
                  <button 
                    key={type}
                    onClick={() => setActiveExport(type)}
                    className={`text-[10px] font-bold px-2 py-1.5 rounded transition-colors ${activeExport === type ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {type.replace('_PROMPT', '')}
                  </button>
              ))}
              </div>
            </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 flex flex-col">
        {state.clusters.length === 0 && state.status !== "CLUSTERING" && state.status !== "EXTRACTING" && state.status !== "IDLE" && state.status !== "CRAWLING" && (
            <div className="text-center text-slate-400 mt-10 text-sm">No analysis to display.</div>
        )}

        {(state.status === "EXTRACTING" || state.status === "CLUSTERING") && (
             <div className="flex justify-center items-center py-20">
                <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
             </div>
        )}

        {/* Clusters */}
        {state.clusters.map((cluster) => {
            const clusterPains = state.pains.filter(p => p.clusterId === cluster.id);
            return (
                <div key={cluster.id} className="p-5 border border-emerald-100 bg-emerald-50/50 rounded-xl relative">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-emerald-900 text-lg">{cluster.clusterName}</h3>
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full border border-emerald-200">Score: {cluster.opportunityScore}</span>
                    </div>
                    <p className="text-sm text-emerald-800/80 mb-4 font-medium">{cluster.clusterSummary}</p>
                    
                    <div className="space-y-3">
                        {clusterPains.slice(0, 2).map((pain, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-emerald-100/50 shadow-sm">
                                <p className="text-xs font-semibold text-slate-500 mb-1">Extracted Pain Point</p>
                                <p className="text-sm text-slate-800">{pain.painPoint}</p>
                                {pain.desiredOutcome && (
                                    <>
                                        <p className="text-xs font-semibold text-slate-500 mt-2 mb-1">Desired Outcome</p>
                                        <p className="text-sm text-slate-800">{pain.desiredOutcome}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )
        })}

        {/* Export Data View */}
        {exportData && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex-1 flex flex-col min-h-[300px]">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex justify-between items-center">
                    <span>Export: {activeExport}</span>
                    <button className="text-xs text-blue-600 hover:underline" onClick={() => navigator.clipboard.writeText(exportData.content)}>Copy</button>
                </h4>
                <div className="flex-1 bg-slate-900 rounded-lg p-4 overflow-auto relative">
                    <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap leading-relaxed">
                        {exportData.content}
                    </pre>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
