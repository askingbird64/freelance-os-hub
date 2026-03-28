import { useState } from "react";

const EXAMPLE_JSON = `{
  "subreddits": {
    "/r/startups": ["problem", "pain point", "how do you", "manual process", "scaling", "tool"],
    "/r/Entrepreneur": ["frustrating", "time consuming", "automate", "workflow", "solution", "software"],
    "/r/indiehackers": ["problem", "pain", "MVP", "validation", "idea", "build"],
    "/r/sideproject": ["feedback", "problem", "idea", "validation", "users", "need"],
    "/r/freelance": ["client", "time tracking", "invoicing", "repetitive", "workload", "burnout"],
    "/r/smallbusiness": ["manual", "inventory", "customer", "spreadsheet", "system", "expensive"],
    "/r/digitalnomad": ["remote", "tools", "automation", "workflow", "productivity", "setup"],
    "/r/productivity": ["system", "workflow", "optimize", "routine", "tool", "efficient"],
    "/r/Notion": ["template", "database", "slow", "limitation", "automation", "integration"],
    "/r/automation": ["automate", "script", "zapier", "make", "manual", "repeat"],
    "/r/youtubers": ["editing", "thumbnail", "workflow", "automation", "content", "burnout"],
    "/r/videoediting": ["render", "workflow", "batch", "export", "plugin", "slow"],
    "/r/gamedev": ["pipeline", "asset", "tool", "workflow", "optimization", "automation"],
    "/r/3Dmodeling": ["render", "asset", "workflow", "plugin", "time", "optimize"]
  },
  "filters": {
    "problem_keywords": ["problem", "frustrating", "annoying", "pain", "difficult"],
    "solution_keywords": ["tool", "software", "automate", "solution", "is there a way"]
  }
}`;

export default function InputPanel({ onStart, isRunning }: { onStart: (config: any) => void; isRunning: boolean }) {
  const [tab, setTab] = useState<"basic" | "bulk">("basic");
  
  // Basic State
  const [keyword, setKeyword] = useState("photo organization");
  const [related, setRelated] = useState("lightroom, folder, messy");
  const [subreddits, setSubreddits] = useState("r/photography, r/productivity");
  const [maxPosts, setMaxPosts] = useState(50);
  const [includeComments, setIncludeComments] = useState(true);

  // Bulk State
  const [bulkJson, setBulkJson] = useState(EXAMPLE_JSON);

  const handleStart = () => {
    if (tab === "basic") {
       onStart({ mode: "basic", mainKeyword: keyword, relatedKeywords: related, subredditList: subreddits, maxPosts, includeComments });
    } else {
       onStart({ mode: "bulk", bulkJson, maxPosts: 15 }); // limits per keyword in bulk
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
         <button onClick={() => setTab("basic")} className={`px-3 py-1.5 text-sm font-bold rounded-t-lg transition-colors ${tab === 'basic' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}>Basic Search</button>
         <button onClick={() => setTab("bulk")} className={`px-3 py-1.5 text-sm font-bold rounded-t-lg transition-colors ${tab === 'bulk' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}>Bulk JSON Upload</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-5">
        
        {tab === "basic" && (
            <>
                <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Main Target/Problem Keyword</label>
                <input 
                    type="text" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" 
                    placeholder="e.g. photo organization" 
                />
                </div>
                
                <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Target Subreddits</span>
                    <span className="text-[10px] text-slate-400 font-normal">Comma separated</span>
                </label>
                <input 
                    type="text" 
                    value={subreddits}
                    onChange={(e) => setSubreddits(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium" 
                    placeholder="r/productivity, r/SaaS" 
                />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Max Posts</label>
                        <input type="number" value={maxPosts} onChange={(e) => setMaxPosts(parseInt(e.target.value))} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium" />
                    </div>
                </div>
            </>
        )}

        {tab === "bulk" && (
            <div className="flex flex-col h-full">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex justify-between">
                    <span>JSON Config Upload</span>
                    <span className="text-[10px] text-amber-500 font-normal lowercase bg-amber-50 px-2 py-0.5 rounded">auto-iterates all keys</span>
                </label>
                <p className="text-[11px] text-slate-400 mb-2 leading-tight">Paste a JSON structured with "subreddits" object containing keyword arrays. The pipeline will sequentially fetch and aggregate everything into memory.</p>
                <textarea 
                    value={bulkJson}
                    onChange={(e) => setBulkJson(e.target.value)}
                    className="flex-1 w-full bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner resize-none min-h-[300px]" 
                    spellCheck={false}
                />
            </div>
        )}

      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-100 flex-shrink-0">
        <button 
          onClick={handleStart}
          disabled={isRunning}
          className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2
            ${isRunning 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200 hover:-translate-y-0.5 active:translate-y-0'
            }`}
        >
          <span className={`items-center gap-2 ${isRunning ? 'flex' : 'hidden'}`}>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Pipeline Running...
          </span>
          <span className={`items-center gap-2 ${!isRunning ? 'flex' : 'hidden'}`}>
              <span className="text-emerald-100">●</span> Start Extraction <span className="text-emerald-100">●</span>
          </span>
        </button>
      </div>
    </div>
  );
}
