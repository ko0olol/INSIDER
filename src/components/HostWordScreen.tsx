import React, { useState } from 'react';
import { Player } from '../types/game';

interface HostWordScreenProps {
  host: Player | null;
  onConfirmWord: (word: string) => void;
}

export const HostWordScreen: React.FC<HostWordScreenProps> = ({ host, onConfirmWord }) => {
  const [word, setWord] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;
    onConfirmWord(word.trim());
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-6">
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-bold rounded-full">พื้นที่ของ Host เท่านั้น</span>
        <h2 className="text-2xl font-bold text-gray-800 mt-3">คุณ <span className="text-indigo-600">{host?.name}</span> โปรดตั้งคำตอบ</h2>
        <p className="text-sm text-gray-500 mt-1">อย่าให้ผู้เล่นคนอื่นเห็นหน้าจอนี้ในขณะกรอกข้อมูล</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="พิมพ์คำตอบที่นี่..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          required
          className="w-full px-4 py-4 text-xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold tracking-wide bg-gray-50"
        />
        <button type="submit" className="w-full py-4 bg-emerald-500 text-white text-xl font-bold rounded-xl hover:bg-emerald-600 active:scale-95 transition shadow-md">
          ยืนยันคำตอบ
        </button>
      </form>
    </div>
  );
};