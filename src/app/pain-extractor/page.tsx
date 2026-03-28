"use client";

import { useState } from "react";
import InputPanel from "@/components/InputPanel";
import DataPanel from "@/components/DataPanel";
import AnalysisPanel from "@/components/AnalysisPanel";
import { AppState, RawContent } from "@/types";

export default function Home() {
  const [state, setState] = useState<AppState>({
    status: "IDLE",
    jobId: null,
    logs: [],
    rawContents: [],
    clusters: [],
    pains: [],
    exports: [],
    activeExport: null,
    config: null
  });

  const runPipeline = async (config: any) => {
    setState(s => ({ ...s, status: "CRAWLING", logs: ["Initializing Memory Pipeline..."], rawContents: [], clusters: [], pains: [], exports: [], config }));

    try {
      let aggregatedRawContents: RawContent[] = [];

      //================= 1. COLLECTION STAGE =================//
      if (config.mode === "bulk") {
          const bulkData = JSON.parse(config.bulkJson);
          const tasks: { sub: string, kw: string }[] = [];
          
          for (const [subreddit, keywords] of Object.entries(bulkData.subreddits || {})) {
              for (const kw of (keywords as string[])) {
                  tasks.push({ sub: subreddit, kw: kw });
              }
          }

          let i = 0;
          for (const task of tasks) {
              i++;
              const msg = `Bulk Crawling: ${task.sub} - "${task.kw}" (${i}/${tasks.length})...`;
              setState(s => ({ ...s, logs: [...s.logs, msg] }));

              try {
                  const res = await fetch('/api/search-reddit', {
                      method: 'POST',
                      body: JSON.stringify({
                          mainKeyword: task.kw,
                          subredditList: task.sub,
                          maxPosts: config.maxPosts || 15
                      })
                  });
                  const data = await res.json();
                  if (data.success && data.rawContents && data.rawContents.length > 0) {
                      const uniqueItems = data.rawContents.map((item: any, index: number) => ({
                          ...item,
                          id: aggregatedRawContents.length + index + 1
                      }));
                      aggregatedRawContents = [...aggregatedRawContents, ...uniqueItems];
                      // 실시간으로 화면에 렌더링 반영
                      setState(s => ({ ...s, rawContents: aggregatedRawContents }));
                  } else {
                      setState(s => ({ ...s, logs: [...s.logs, `⚠️ 건너뜀: ${task.sub} - "${task.kw}" 검색 결과 없음 또는 API 응답 거부`] }));
                  }
              } catch (innerErr: any) {
                  console.warn("Bulk fetch iteration error:", innerErr);
                  setState(s => ({ ...s, logs: [...s.logs, `💥 에러 (패스됨): ${task.sub} - "${task.kw}" 통신 오류 발생. 다음으로 넘어갑니다.`] }));
              }
              // Rate limit UI delay 
              await new Promise(resolve => setTimeout(resolve, 800));
          }
      } else {
          // BASIC MODE
          setState(s => ({ ...s, logs: [...s.logs, `Searching Live Reddit for "${config.mainKeyword}"...`] }));
          const res = await fetch('/api/search-reddit', {
              method: 'POST',
              body: JSON.stringify({
                  mainKeyword: config.mainKeyword,
                  subredditList: config.subredditList,
                  maxPosts: config.maxPosts
              })
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.error);
          aggregatedRawContents = data.rawContents || [];
      }

      if (aggregatedRawContents.length === 0) {
          throw new Error("검색된 Reddit 게시물이 하나도 없습니다. 키워드를 변경하거나 파일 문법을 확인하세요.");
      }

      setState(s => ({ ...s, status: "EXTRACTING", rawContents: aggregatedRawContents, logs: [...s.logs, "Extracting pain points from raw data..."] }));
      
      //================= 2. EXTRACT STAGE (MOCK UI) =================//
      await new Promise(r => setTimeout(r, 600));
      setState(s => ({ ...s, status: "CLUSTERING", logs: [...s.logs, "Clustering similarities using mock LLM logic..."] }));

      //================= 3. CLUSTERING STAGE (MOCK UI) =================//
      await new Promise(r => setTimeout(r, 600));

      // Create dynamic clusters based on input
      const mainTheme = config.mode === "bulk" ? "복수의 다중 키워드 데이터" : config.mainKeyword;
      const clusters = [
          { id: 1, clusterName: `핵심 불만: ${mainTheme} 연관`, clusterSummary: `사용자들은 본 작업과 관계된 비효율성 및 수동 작업 반복에 피로를 호소하고 있습니다.`, frequencyScore: Math.floor(Math.random()*20+80), opportunityScore: Math.floor(Math.random()*20+80) },
          { id: 2, clusterName: "대안의 부재 혹은 한계", clusterSummary: "복잡하고 제한적인 기존 시스템 구조에서 오는 근본적인 결함들입니다.", frequencyScore: Math.floor(Math.random()*30+60), opportunityScore: Math.floor(Math.random()*30+65) }
      ];

      const pains = aggregatedRawContents.slice(0, 8).map((post: any, idx: number) => ({
          id: post.id, 
          painPoint: `"${post.rawText.substring(0, 50).trim()}..." 문제`, 
          desiredOutcome: "시간/비용 낭비를 줄여줄 새로운 형태의 도구가 필요함", 
          clusterId: (idx % 2) + 1 
      }));

      setState(s => ({ ...s, status: "EXPORTING", logs: [...s.logs, "Generating Export Artifacts..."] }));
      await new Promise(r => setTimeout(r, 500));

      //================= 4. EXPORT STAGE =================//
      const jsonStr = JSON.stringify({
          bulk_mode: config.mode === "bulk",
          total_contents_analyzed: aggregatedRawContents.length,
          top_pain_clusters: clusters,
          extracted_pains: pains.map(p => p.painPoint)
      }, null, 2);

      const mdStr = `# Product Insight Report\n\nTotal Analyzed: ${aggregatedRawContents.length}\n\nTop issue: ${clusters[0].clusterName}\nScore: ${clusters[0].opportunityScore}`;

      const exports = [
          { type: "JSON", content: jsonStr },
          { type: "MARKDOWN", content: mdStr },
          { type: "CHATBOT_PROMPT", content: `Please generate a PRD based on this large subset of data:\n\n${jsonStr}` },
          { type: "ANTIGRAVITY_PROMPT", content: `Create an MVP Next.js app that solves:\n\n${jsonStr}` }
      ];

      setState(s => ({
          ...s,
          status: "DONE",
          exports,
          clusters,
          pains,
          activeExport: "JSON",
          logs: [...s.logs, "Pipeline Completed successfully!"]
      }));

    } catch (err: any) {
        alert("Pipeline failed: " + err.message);
        setState(s => ({ ...s, status: "ERROR" }));
    }
  };

  return (
    <main className="h-screen bg-slate-50 text-slate-900 p-4 md:p-6 lg:p-8 flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col gap-6 flex-1 min-h-0">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-200 shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-2xl shadow-lg shadow-amber-500/20 border-2 border-amber-200" />
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent tracking-tight flex items-center gap-3">
                PainExtractor <span className="text-sm font-bold text-amber-500">MVP</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-sm border border-amber-200 tracking-widest shadow-sm">HANWOOLMAN 제작</span>
              </h1>
            <div className="flex items-center gap-2 mt-1">
                <span className="flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${state.status === 'ERROR' ? 'bg-red-400' : state.status === 'IDLE' ? 'bg-slate-400' : 'bg-emerald-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${state.status === 'ERROR' ? 'bg-red-500' : state.status === 'IDLE' ? 'bg-slate-500' : 'bg-emerald-500'}`}></span>
                </span>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">System Status: {state.status}</p>
            </div>
          </div>
          </div>
          <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm border border-amber-200">Bulk Crawler Enabled</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm border border-slate-200">100% In-Memory</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 w-full overflow-hidden">
          <InputPanel onStart={runPipeline} isRunning={state.status !== "IDLE" && state.status !== "DONE" && state.status !== "ERROR"} />
          <DataPanel state={state} />
          <AnalysisPanel state={state} />
        </div>
      </div>
    </main>
  );
}
