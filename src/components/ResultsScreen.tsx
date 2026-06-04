import React from 'react';
import { Player, PlayerRoleMap } from '../types/game';

interface ResultsScreenProps {
  word: string;
  host: Player | null;
  playerRoles: PlayerRoleMap;
  votedPlayerId: string;
  players: Player[];
  timeUsedSeconds: number;
  onPlayAgain: () => void;
  onReset: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  word,
  host,
  playerRoles,
  votedPlayerId,
  players,
  timeUsedSeconds,
  onPlayAgain,
  onReset,
}) => {
  const votedPlayer = players.find((p) => p.id === votedPlayerId);
  const isInsiderCaught = playerRoles[votedPlayerId] === 'INSIDER';
  const gameWinner = isInsiderCaught ? 'PLAYER WIN' : 'INSIDER WIN';

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const insiderPlayer = players.find((p) => playerRoles[p.id] === 'INSIDER');

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h1 className="text-3xl font-black text-center text-slate-800 mb-6">📊 สรุปผลลัพธ์</h1>

      <div className="text-center p-6 rounded-2xl mb-6 bg-slate-900 text-white shadow-inner">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">บทสรุปฝั่งผู้ชนะ</span>
        <h2 className={`text-4xl font-extrabold tracking-wider ${isInsiderCaught ? 'text-emerald-400' : 'text-red-400'}`}>
          {gameWinner}
        </h2>
      </div>

      <div className="space-y-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-500">คำตอบหลัก:</span>
          <span className="font-bold text-gray-800">{word}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-500">Host (ผู้ตั้งคำ):</span>
          <span className="font-bold text-indigo-700">{host?.name}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-500">Insider ตัวจริง:</span>
          <span className="font-bold text-red-600">{insiderPlayer?.name}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-500">ผู้ที่โดนโหวตออก:</span>
          <span className="font-bold text-amber-700">{votedPlayer?.name} ({playerRoles[votedPlayerId]})</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-gray-500">เวลาที่ใช้ไป:</span>
          <span className="font-mono font-bold text-gray-800">{formatTime(timeUsedSeconds)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={onPlayAgain} className="py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 active:scale-95 transition text-center shadow-md">
          เล่นรอบใหม่
        </button>
        <button onClick={onReset} className="py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 active:scale-95 transition text-center">
          กลับหน้าแรก
        </button>
      </div>
    </div>
  );
};