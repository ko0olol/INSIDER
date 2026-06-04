import React, { useState } from 'react';

interface InsiderRevealScreenProps {
  word: string;
  onNext: () => void;
}

export const InsiderRevealScreen: React.FC<InsiderRevealScreenProps> = ({ word, onNext }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
      {!isRevealed ? (
        <div className="space-y-6 py-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <h2 className="text-2xl font-black text-red-600 mb-2">⚠️ ขั้นตอนลับเฉพาะ Insider</h2>
            <p className="text-lg text-gray-700 font-bold">1. ให้ทุกคนในวงหลับตาลง</p>
            <p className="text-base text-gray-600 mt-1">2. ให้ผู้เล่นที่เป็น <span className="text-red-600 font-bold">INSIDER</span> ลืมตาขึ้นมาคนเดียวเพื่อกดดูคำตอบ</p>
          </div>
          <button onClick={() => setIsRevealed(true)} className="w-full py-5 bg-red-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-red-700 active:scale-95 transition">
            แสดงคำตอบ
          </button>
        </div>
      ) : (
        <div className="fixed inset-0 bg-slate-900 flex flex-col justify-between p-8 z-50 animate-fade-in">
          <div className="text-center mt-8">
            <span className="text-red-400 font-bold tracking-widest text-sm uppercase block mb-2">คำตอบลับประจำเกม</span>
            <p className="text-xs text-gray-400">ห้ามส่งเสียงหรือแสดงพิรุธเด็ดขาด!</p>
          </div>

          <div className="my-auto text-center px-4">
            <h1 className="text-6xl md:text-7xl font-black text-white bg-slate-800 p-8 rounded-3xl tracking-wide break-words border border-slate-700 shadow-2xl">
              {word}
            </h1>
          </div>

          <button onClick={onNext} className="w-full py-5 bg-emerald-500 text-white text-2xl font-bold rounded-2xl shadow-xl hover:bg-emerald-600 active:scale-95 transition">
            จำได้แล้ว (ซ่อนคำตอบและเริ่มเกม)
          </button>
        </div>
      )}
    </div>
  );
};