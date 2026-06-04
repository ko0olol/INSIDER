import React, { useState } from 'react';
import { Player } from '../types/game';

interface SetupScreenProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onNext: () => void;
  gameTimeMinutes: number;
  setGameTimeMinutes: (minutes: number) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  players,
  setPlayers,
  onNext,
  gameTimeMinutes,
  setGameTimeMinutes,
}) => {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setPlayers([...players, { id: crypto.randomUUID(), name: newName.trim() }]);
    newName && setNewName('');
  };

  const handleDeletePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingName.trim()) return;
    setPlayers(players.map((p) => (p.id === id ? { ...p, name: editingName.trim() } : p)));
    setEditingId(null);
  };

  // ✨ ฟังก์ชันสำหรับล้างชื่อทั้งหมด (กรณีเปลี่ยนกลุ่มเล่นใหม่)
  const handleClearAllPlayers = () => {
    if (window.confirm('คุณต้องการล้างรายชื่อผู้เล่นทั้งหมดใช่หรือไม่?')) {
      setPlayers([]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-indigo-900 tracking-tight">INSIDER GAME</h1>
        <p className="text-sm text-gray-400 mt-1">ใส่อย่างน้อย 4 คนเพื่อเริ่มสุ่มบทบาท</p>
      </div>

      <form onSubmit={handleAddPlayer} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="ใส่ชื่อผู้เล่น..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
        />
        <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 active:scale-95 transition text-lg">
          เพิ่ม
        </button>
      </form>

      {/* 👥 หัวข้อรายชื่อ + ปุ่มล้างทั้งหมด */}
      <div className="flex justify-between items-center mb-2 px-1">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">👥 รายชื่อผู้เล่น ({players.length})</h2>
        {players.length > 0 && (
          <button 
            onClick={handleClearAllPlayers}
            className="text-xs font-semibold text-gray-400 hover:text-red-500 transition"
          >
            ล้างทั้งหมด
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto mb-6 pr-1 border border-gray-100 rounded-xl p-2 bg-gray-50/50">
        {players.map((player) => (
          <div key={player.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
            {editingId === player.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleSaveEdit(player.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(player.id)}
                autoFocus
                className="flex-1 px-2 py-1 border border-indigo-500 rounded focus:outline-none bg-white text-lg"
              />
            ) : (
              <span onClick={() => startEdit(player.id, player.name)} className="text-lg text-gray-800 cursor-pointer hover:text-indigo-600 font-medium">
                {player.name}
              </span>
            )}
            <button onClick={() => handleDeletePlayer(player.id)} className="text-red-400 hover:text-red-600 p-1 text-sm font-semibold">
              ลบ
            </button>
          </div>
        ))}
        {players.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">ยังไม่มีรายชื่อผู้เล่น (ต้องการขั้นต่ำ 4 คน)</p>}
      </div>

      {/* ⏱️ ส่วนตั้งค่าเวลาเกม */}
      <div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="font-bold text-indigo-950 text-sm">ตั้งเวลาอภิปราย</h3>
          <p className="text-xs text-gray-400 mt-0.5">เวลาในการซักถามคำถามโฮสต์</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={gameTimeMinutes <= 1}
            onClick={() => setGameTimeMinutes(gameTimeMinutes - 1)}
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-black text-lg flex items-center justify-center hover:bg-gray-100 active:scale-90 transition disabled:opacity-40"
          >
            -
          </button>
          <span className="text-xl font-black text-indigo-900 min-w-16 text-center">
            {gameTimeMinutes} นาที
          </span>
          <button
            type="button"
            disabled={gameTimeMinutes >= 15}
            onClick={() => setGameTimeMinutes(gameTimeMinutes + 1)}
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-black text-lg flex items-center justify-center hover:bg-gray-100 active:scale-90 transition disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={players.length < 4}
        className={`w-full py-4 text-xl font-bold rounded-xl transition ${
          players.length >= 4 ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-md shadow-indigo-100' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        เริ่มสุ่มเกม ({players.length}/4 คนขึ้นไป)
      </button>
    </div>
  );
};