"use client";

import { useState, useEffect } from "react";

interface InvoiceItem {
  id: string;
  desc: string;
  qty: number;
  price: number;
}

export default function QuickBill() {
  // Sender Details
  const [senderName, setSenderName] = useState("프리랜서 김토끼");
  const [senderEmail, setSenderEmail] = useState("tokki@freelance.com");
  const [senderPhone, setSenderPhone] = useState("010-1234-5678");

  // Client Details
  const [clientName, setClientName] = useState("주식회사 예시 클라이언트");
  const [clientCompany, setClientCompany] = useState("디자인 부서 담당자님");
  const [clientAddress, setClientAddress] = useState("서울시 강남구 테헤란로 123");

  // Invoice Meta
  const [invoiceNo, setInvoiceNo] = useState("INV-2023-001");
  const [issueDate, setIssueDate] = useState("2023-11-01");
  const [dueDate, setDueDate] = useState("2023-11-15");

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", desc: "웹사이트 UI/UX 디자인 (메인+서브 5P)", qty: 1, price: 1500000 },
    { id: "2", desc: "로고 및 브랜드 가이드라인 제작", qty: 1, price: 800000 },
    { id: "3", desc: "아이콘 에셋 베리에이션", qty: 3, price: 100000 },
  ]);

  const [taxRate, setTaxRate] = useState(10); // 부가세 10%
  const [notes, setNotes] = useState("믿고 맡겨주셔서 감사합니다. 지정된 기일 내에 아래 계좌로 입금 부탁드립니다.\n[국민은행 123456-00-123456 김토끼]");

  // Handlers
  const handleAddItem = () => {
    setItems([...items, { id: Math.random().toString(), desc: "", qty: 1, price: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const taxAmount = Math.floor(subtotal * (taxRate / 100));
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800 print:bg-white print:p-0">
      
      {/* 🛠️ LEFT PANEL : Edit Form (Hidden during print) */}
      <div className="w-[450px] bg-white border-r border-slate-200 h-screen overflow-y-auto shrink-0 print:hidden shadow-lg z-10 flex flex-col">
        <div className="p-6 bg-slate-900 text-white sticky top-0 z-20">
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo.png" alt="QuickBill Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-500/20 border border-emerald-400" />
            <span className="text-[10px] font-bold bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-sm border border-emerald-700 tracking-widest">HANWOOLMAN 제작</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            QuickBill <span className="text-emerald-400">MVP</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">10초 완성 무상태(Stateless) PDF 인보이스</p>
          
          <button 
            onClick={handlePrint}
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            PDF 다운로드 (인쇄)
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Sender Info */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">나의 정보 (내 보내는 사람)</h2>
            <div className="space-y-3">
              <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="이름/상호명" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
              <input type="text" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} placeholder="이메일" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
              <input type="text" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} placeholder="연락처" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </section>

          {/* Client Info */}
          <section className="space-y-4 border-t border-slate-100 pt-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">고객 정보 (받는 사람)</h2>
            <div className="space-y-3">
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="고객사 상호명" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
              <input type="text" value={clientCompany} onChange={e => setClientCompany(e.target.value)} placeholder="담당자 / 부서" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
              <input type="text" value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder="주소" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </section>

          {/* Invoice Meta */}
          <section className="space-y-4 border-t border-slate-100 pt-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">문서 설정</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-500 block mb-1">인보이스 번호</label>
                <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">발행일</label>
                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">결제 기한(Due Date)</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-rose-500" />
              </div>
            </div>
          </section>

          {/* Items */}
          <section className="space-y-4 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">청구 항목 (Items)</h2>
               <button onClick={handleAddItem} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100 transition-colors">+ 추가</button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 relative group">
                  <button onClick={() => handleRemoveItem(item.id)} className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">×</button>
                  <input type="text" value={item.desc} onChange={e => updateItem(item.id, 'desc', e.target.value)} placeholder="품목 설명" className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none mb-2" />
                  <div className="flex gap-2">
                    <div className="w-20">
                      <input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} placeholder="수량" className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-center" />
                    </div>
                    <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-md px-3 focus-within:ring-2 focus-within:ring-emerald-500">
                      <span className="text-slate-400 text-sm font-bold mr-1">₩</span>
                      <input type="number" value={item.price} onChange={e => updateItem(item.id, 'price', parseInt(e.target.value) || 0)} placeholder="단가" className="w-full bg-transparent py-2 text-sm font-bold outline-none text-right" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between bg-slate-100 p-4 rounded-xl">
              <span className="text-sm font-bold text-slate-500">부가세 (Tax) %</span>
              <input type="number" value={taxRate} onChange={e => setTaxRate(parseInt(e.target.value) || 0)} className="w-16 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm font-bold outline-none text-center" />
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-4 border-t border-slate-100 pt-6 pb-20">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">메모 및 계좌번호</h2>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none resize-none leading-relaxed" />
          </section>
        </div>
      </div>


      {/* 📄 RIGHT PANEL : A4 Live Preview (Printed content) */}
      <div className="flex-1 overflow-y-auto p-12 flex justify-center print:p-0 print:overflow-visible bg-slate-800 print:bg-white select-none">
        
        {/* A4 Sheet Container */}
        <div className="bg-white shadow-2xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] p-[20mm] relative font-sans text-slate-900 border border-slate-200 print:border-none print:w-full print:max-w-none print:min-h-0 mx-auto transform transform-gpu origin-top transition-all">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-bl-full opacity-10 print:opacity-20 -z-10"></div>
          
          {/* Header */}
          <header className="flex justify-between items-start mb-16 border-b-2 border-slate-900 pb-8">
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">INVOICE</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">청구서 / 거래명세서</p>
            </div>
            <div className="text-right space-y-1 mt-2">
              <p className="font-bold text-slate-400 text-sm">Invoice No. <span className="text-slate-800">{invoiceNo || "-"}</span></p>
              <p className="font-bold text-slate-400 text-sm">Issue Date <span className="text-slate-800">{issueDate || "-"}</span></p>
              <p className="font-bold text-slate-400 text-sm">Due Date <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{dueDate || "-"}</span></p>
            </div>
          </header>

          {/* Info Blocks */}
          <div className="flex justify-between mb-16 gap-8">
            <div className="flex-1 space-y-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-l-4 border-slate-300 pl-2">Billed To (받는 사람)</h3>
              <p className="text-xl font-black text-slate-800 tracking-tight">{clientName || "Client Name"}</p>
              <p className="font-bold text-slate-600">{clientCompany}</p>
              <p className="font-medium text-slate-500 text-sm mt-2 leading-relaxed max-w-[250px]">{clientAddress}</p>
            </div>
            
            <div className="flex-1 space-y-2 text-right">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-r-4 border-emerald-400 pr-2">From (보내는 사람)</h3>
              <p className="text-xl font-black text-slate-800 tracking-tight">{senderName || "My Name"}</p>
              <p className="font-bold text-slate-600">{senderEmail}</p>
              <p className="font-bold text-slate-600">{senderPhone}</p>
            </div>
          </div>

          {/* Table */}
          <div className="mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800">
                  <th className="py-3 px-2 text-xs font-black text-slate-500 uppercase tracking-widest w-[50%]">Description</th>
                  <th className="py-3 px-2 text-xs font-black text-slate-500 uppercase tracking-widest text-center w-[15%]">Qty</th>
                  <th className="py-3 px-2 text-xs font-black text-slate-500 uppercase tracking-widest text-right w-[15%]">Price</th>
                  <th className="py-3 px-2 text-xs font-black text-slate-500 uppercase tracking-widest text-right w-[20%]">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-bold">청구 항목이 없습니다. 좌측에서 추가해주세요.</td>
                  </tr>
                )}
                {items.map(item => (
                  <tr key={item.id} className="group">
                    <td className="py-4 px-2 font-bold text-slate-800">{item.desc || "품목명 없음"}</td>
                    <td className="py-4 px-2 font-bold text-slate-600 text-center">{item.qty}</td>
                    <td className="py-4 px-2 font-bold text-slate-600 text-right">{item.price.toLocaleString()}</td>
                    <td className="py-4 px-2 font-black text-slate-800 text-right">{(item.qty * item.price).toLocaleString()} 원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary / Total */}
          <div className="flex justify-end mb-16">
            <div className="w-1/2 space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-bold text-slate-500 text-sm">공급가액 (Subtotal)</span>
                <span className="font-black text-slate-700">{subtotal.toLocaleString()} 원</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-bold text-slate-500 text-sm">부가세 (Tax {taxRate}%)</span>
                <span className="font-black text-slate-700">{taxAmount.toLocaleString()} 원</span>
              </div>
              <div className="flex justify-between py-4 border-b-2 border-slate-800 mt-2 bg-slate-50/50 px-2 rounded-lg">
                <span className="font-black text-slate-800 text-xl">총 청구 금액 (Total)</span>
                <span className="font-black text-emerald-600 text-2xl tracking-tighter">{total.toLocaleString()} 원</span>
              </div>
            </div>
          </div>

          {/* Footer / Notes */}
          <div className="mt-auto pt-16 border-t border-slate-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Notes & Payment Details</h3>
            <p className="text-sm font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">
              {notes || "결제와 관련된 메모나 계좌번호를 남겨주세요."}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
