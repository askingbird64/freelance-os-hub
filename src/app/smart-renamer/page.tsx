"use client";

import { useState, useEffect, MouseEvent } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import AdModal from "../../components/AdModal";
import { Lock } from "lucide-react";

interface FileItem {
  id: string;
  originalName: string;
  extension: string;
  size: number;
  newName: string;
  fileObj?: File;
}

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [replaceFrom, setReplaceFrom] = useState("");
  const [replaceTo, setReplaceTo] = useState("");
  
  const [usePrefixCounter, setUsePrefixCounter] = useState(false);
  const [useSuffixCounter, setUseSuffixCounter] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 백스페이스/Delete 키로 다중 선택 항목 삭제
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 텍스트 인풋창에서 백스페이스 누른 경우는 무시
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      if (e.key === "Backspace" || e.key === "Delete") {
        if (selectedIds.size > 0) {
          e.preventDefault(); // 뒤로가기 방지
          setFiles(prev => prev.filter(f => !selectedIds.has(f.id)));
          setSelectedIds(new Set());
          setLastSelectedId(null);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds]);

  const loadMockFiles = () => {
    const mocks = [
      "IMG_9912.JPG", "final_cut_v2_real_final(1).mp4", "스크린샷 2023-10-12 오후 4.33.22.png",
      "KakaoTalk_20231012_123456789.mp4", "untitled_project_1.aep", "Audio Track 4 - Copy.wav",
      "KakaoTalk_receipt_01.jpg", "스크린샷 2023-11-01.png", "최종_PPT_제출용.pptx"
    ];
    
    const newFiles = mocks.map((name) => {
      const extMatch = name.match(/\.[0-9a-z]+$/i);
      const ext = extMatch ? extMatch[0] : "";
      return {
        id: Math.random().toString(36).substring(7),
        originalName: name,
        extension: ext,
        size: Math.floor(Math.random() * 5000000) + 1024,
        newName: name
      };
    });
    setFiles(prev => [...prev, ...newFiles]);
  };

  const clearAllFiles = () => {
    setFiles([]);
    setSelectedIds(new Set());
    setLastSelectedId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const uploaded = Array.from(e.target.files).map(f => {
      const extMatch = f.name.match(/\.[0-9a-z]+$/i);
      return {
        id: Math.random().toString(36).substring(7),
        originalName: f.name,
        extension: extMatch ? extMatch[0] : "",
        size: f.size,
        newName: f.name,
        fileObj: f
      };
    });
    setFiles(prev => [...prev, ...uploaded]);
    e.target.value = '';
  };

  const handleDeleteSelected = () => {
    setFiles(files.filter(f => !selectedIds.has(f.id)));
    setSelectedIds(new Set());
    setLastSelectedId(null);
  };

  const toggleSelection = (id: string, e: MouseEvent) => {
    const newSelected = new Set(selectedIds);
    
    if (e.shiftKey && lastSelectedId) {
      const currentIndex = files.findIndex(f => f.id === id);
      const lastIndex = files.findIndex(f => f.id === lastSelectedId);
      
      const start = Math.min(currentIndex, lastIndex);
      const end = Math.max(currentIndex, lastIndex);
      
      for (let i = start; i <= end; i++) {
        newSelected.add(files[i].id);
      }
    } else if (e.ctrlKey || e.metaKey) {
      if (newSelected.has(id)) newSelected.delete(id);
      else newSelected.add(id);
      setLastSelectedId(id);
    } else {
      if (newSelected.has(id) && newSelected.size === 1) {
          newSelected.delete(id);
      } else {
          newSelected.clear();
          newSelected.add(id);
      }
      setLastSelectedId(id);
    }
    setSelectedIds(newSelected);
  };

  const getPreviewName = (file: FileItem, index: number) => {
    let nameWithoutExt = file.originalName;
    if (file.extension) {
        const extIdx = file.originalName.lastIndexOf(file.extension);
        if (extIdx !== -1) {
            nameWithoutExt = file.originalName.substring(0, extIdx);
        }
    }
    
    if (replaceFrom) {
      nameWithoutExt = nameWithoutExt.split(replaceFrom).join(replaceTo);
    }
    
    let finalName = nameWithoutExt;
    
    if (prefix) finalName = `${prefix}${finalName}`;
    if (suffix) finalName = `${finalName}${suffix}`;
    
    if (usePrefixCounter) {
        finalName = `${String(index + 1).padStart(3, '0')}_${finalName}`;
    }
    if (useSuffixCounter) {
        finalName = `${finalName}_${String(index + 1).padStart(3, '0')}`;
    }
    
    return finalName + file.extension.toLowerCase();
  };

  const handleDownloadAll = async () => {
    setIsModalOpen(false);
    if (files.length === 0) return;
    setIsDownloading(true);
    try {
        const zip = new JSZip();
        files.forEach((file, index) => {
            const finalName = getPreviewName(file, index);
            if (file.fileObj) {
                zip.file(finalName, file.fileObj);
            } else {
                zip.file(finalName, "이 파일은 원본이 없는 샘플 테스트용 예시 파일 형식입니다.");
            }
        });
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, "Renamed_Assets_Export.zip");
    } catch (err) {
        alert("압축 및 다운로드 중 문제가 발생했습니다.");
    } finally {
        setIsDownloading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800 selection:bg-indigo-200">
      
      {/* Sidebar: Rules Panel */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-[100dvh] shadow-sm z-10 shrink-0">
        <div className="p-6 border-b border-slate-100 bg-indigo-600">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            SmartRenamer
          </h1>
          <p className="text-indigo-200 text-xs mt-1 font-medium">로컬 에셋 일괄 변경 및 저장 툴</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">단어 치환 (Replace)</h3>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">이 단어를 찾아서</label>
              <input type="text" value={replaceFrom} onChange={e => setReplaceFrom(e.target.value)} placeholder="예: KakaoTalk" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">이렇게 바꿈</label>
              <input type="text" value={replaceTo} onChange={e => setReplaceTo(e.target.value)} placeholder="예: ClientAsset" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">접두/접미어 (Affix)</h3>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">앞에 붙이기 (Prefix)</label>
              <input type="text" value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="예: [231012]_" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">뒤에 붙이기 (Suffix)</label>
              <input type="text" value={suffix} onChange={e => setSuffix(e.target.value)} placeholder="예: _v2" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">순번 매기기 (Sequence)</h3>
            <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={usePrefixCounter} onChange={(e) => setUsePrefixCounter(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">이름 앞에 숫자 매기기 (001_이름)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={useSuffixCounter} onChange={(e) => setUseSuffixCounter(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">이름 뒤에 숫자 매기기 (이름_001)</span>
                </label>
            </div>
          </div>

        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={files.length === 0 || isDownloading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isDownloading ? (
               <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
               <Lock className="w-5 h-5 text-white/90" />
            )}
            일괄 변경 및 다운로드 (10초 대기)
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden">
        
        {/* Top Header */}
        <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10 w-full overflow-x-auto">
          <div className="flex items-center gap-4 shrink-0">
            <h2 className="text-xl font-bold text-slate-800">작업 대기열</h2>
            <span className="bg-slate-100 text-slate-600 text-sm py-1 px-3 rounded-full font-bold shadow-inner">{files.length} 파일</span>
            
            {selectedIds.size > 0 && (
              <button 
                onClick={handleDeleteSelected}
                className="ml-4 flex items-center gap-1.5 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors animate-in fade-in"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                선택 항목 삭제 (백스페이스)
              </button>
            )}
          </div>
          
          <div className="flex gap-0 shrink-0 ml-4">
             <button onClick={loadMockFiles} className="text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-4 py-2.5 rounded-l-xl transition-colors shadow-sm">
               💡 예시 넣기
             </button>
             <button onClick={clearAllFiles} className="text-sm font-semibold text-rose-600 bg-rose-50 border-y border-r border-rose-100 hover:bg-rose-100 px-3 py-2.5 transition-colors shadow-sm border-l-0">
               🗑️ 뺄수있게(비우기)
             </button>
             <label className="cursor-pointer text-sm font-bold text-white bg-slate-800 border border-slate-900 hover:bg-slate-900 px-5 py-2.5 rounded-r-xl transition-colors shadow-md flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
               직접 업로드
               <input type="file" multiple className="hidden" onChange={handleFileUpload} />
             </label>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          {files.length === 0 ? (
            <div className="h-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-white/50 backdrop-blur-sm">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-3">변경할 파일들을 이곳에 끌어다 놓으세요</h3>
              <p className="text-slate-500 text-lg max-w-lg leading-relaxed">
                영상 소스, 수천 개의 엑셀 파일 등 이름이 제멋대로인 파일들을 한방에 규칙적으로 정리해 드립니다. <br/>
                <span className="text-indigo-500 font-semibold mb-2 block mt-2">✨ 보안 걱정 끝!</span>
                실제 서버로 파일이 단 1byte도 전송되지 않고, 오직 현재 브라우저 로컬 안에서만 0.1초 만에 안전하게 즉시 변환 처리됩니다!
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden select-none">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50 border-b border-slate-200">
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-5 text-center">✓</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-5">#</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[40%]">원본 파일명 (Before)</th>
                     <th className="px-6 py-4 text-xs font-bold text-indigo-600 uppercase tracking-wider w-[50%] bg-indigo-50/30">변경될 파일명 (After Preview)</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {files.map((file, idx) => {
                     const before = file.originalName;
                     const after = getPreviewName(file, idx);
                     const isChanged = before !== after;
                     const isSelected = selectedIds.has(file.id);
                     
                     return (
                       <tr 
                          key={file.id} 
                          onClick={(e) => toggleSelection(file.id, e)}
                          className={`hover:bg-indigo-50/40 transition-colors cursor-pointer ${isSelected ? 'bg-indigo-50/60' : ''}`}
                       >
                         <td className="px-6 py-4 text-center">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 pointer-events-none"
                                checked={isSelected}
                                readOnly
                            />
                         </td>
                         <td className="px-6 py-4 text-sm font-medium text-slate-400">{idx + 1}</td>
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <span className="text-2xl transition-opacity">
                                {file.extension.includes("mp4") || file.extension.includes("mov") ? "🎬" : 
                                 file.extension.includes("jpg") || file.extension.includes("png") ? "🖼️" : "📄"}
                              </span>
                              <div>
                                <div className="text-sm font-bold text-slate-700 truncate max-w-sm" title={before}>{before}</div>
                                <div className="text-xs text-slate-400 mt-0.5 tracking-wide">
                                    {formatBytes(file.size)} {file.fileObj ? <span className="text-emerald-500 ml-1 font-semibold">• 실제 파일</span> : <span className="text-amber-500 ml-1 font-semibold">• 샘플 파일 (내용 없음)</span>}
                                </div>
                              </div>
                           </div>
                         </td>
                         <td className={`px-6 py-4 text-[15px] font-black tracking-tight ${isChanged ? 'text-indigo-600 bg-indigo-50/20' : 'text-slate-400'}`}>
                           {isChanged ? (
                             <div className="flex items-center gap-2">
                               <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                               <span className="truncate max-w-md">{after}</span>
                             </div>
                           ) : (
                             <span className="truncate max-w-md">{after}</span>
                           )}
                         </td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
            </div>
          )}
        </div>

      </div>
      <AdModal isOpen={isModalOpen} onComplete={handleDownloadAll} />
    </div>
  );
}
