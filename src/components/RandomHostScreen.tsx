import React from 'react';
import { Player } from '../types/game';

interface RandomHostScreenProps {
  host: Player | null;
  onNext: () => void;
}

export const RandomHostScreen: React.FC<RandomHostScreenProps> = ({ host, onNext }) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl text-center border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-500 mb-2 uppercase tracking-wide">สุ่มได้ผู้ดำเนินรายการ</h2>
      <div className="my-8 p-6 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 animate-pulse">
        <span className="text-sm font-bold text-indigo-500 block mb-1">HOST คือใคร?</span>
        <span className="text-4xl font-extrabold text-indigo-900 tracking-tight">{host?.name}</span>
      </div>
      <p className="text-gray-600 mb-6 text-base">ให้ส่งมือถือเครื่องนี้ไปให้ <strong className="text-indigo-700">{host?.name}</strong> เพื่อตั้งคำตอบประจำรอบ</p>
      <button onClick={onNext} className="w-full py-4 bg-indigo-600 text-white text-xl font-bold rounded-xl hover:bg-indigo-700 active:scale-95 transition shadow-md">
        ดำเนินการต่อ
      </button>
    </div>
  );
};