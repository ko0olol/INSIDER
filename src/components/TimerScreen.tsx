import React, { useState, useEffect } from 'react';

interface TimerScreenProps {
  gameTimeMinutes: number;
  onStopGame: (timeUsedSeconds: number) => void;
  word: string; // ✨ รับคำศัพท์ปัจจุบันมา
  setWord: (newWord: string) => void; // ✨ รับฟังก์ชันสำหรับแก้ไขคำศัพท์
}

export const TimerScreen: React.FC<TimerScreenProps> = ({ 
  gameTimeMinutes, 
  onStopGame, 
  word, 
  setWord 
}) => {
  const totalSeconds = gameTimeMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(true);

  // 🛠️ States สำหรับฟังก์ชันแอบดูและแก้ไขคำศัพท์
  const [showWord, setShowWord] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(word);

  const timeUsed = totalSeconds - timeLeft;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    // ⏱️ เวลาจะเดินต่อเมื่อ isActive เป็น true และไม่ได้อยู่ในโหมดกำลังแก้ไขคำศัพท์
    if (isActive && timeLeft > 0 && !isEditing) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } 
    
    if (timeLeft === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
      onStopGame(timeUsed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onStopGame, timeUsed, isEditing]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ✏️ ฟังก์ชันเปิดโหมดแก้ไขคำ (จะทำการหยุดเวลาอัตโนมัติ)
  const handleOpenEdit = () => {
    setEditInput(word);
    setIsEditing(true);
  };

  // 💾 ฟังก์ชันบันทึกคำศัพท์ที่แก้ไข
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInput.trim()) return;
    setWord(editInput.trim());
    setIsEditing(false); // ปิดโหมดแก้ไข เวลาจะกลับมาเดินต่อทันที
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
        ช่วงเวลาอภิปรายและสอบถาม
      </span>
      
      {/* ⏱️ ส่วนแสดงผลเวลาขนาดยักษ์ */}
      <div className="my-6">
        <h1 className={`text-7xl font-black font-mono tracking-tight transition-colors ${isEditing ? 'text-amber-500' : 'text-slate-800'}`}>
          {formatTime(timeLeft)}
        </h1>
        {isEditing ? (
          <p className="text-xs text-amber-600 font-bold mt-2 animate-pulse">⏸️ หยุดเวลาชั่วคราวเพื่อแก้ไขคำปริศนา...</p>
        ) : (
          <p className="text-sm text-gray-400 mt-2">ทุกคนสามารถรุมถามคำถามกับ Host ได้ทันที</p>
        )}
      </div>

      {/* 🎮 กลุ่มปุ่มกดควบคุมสถานะเกมหลัก */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => !isEditing && onStopGame(timeUsed)}
          disabled={isEditing}
          className="w-full py-4 bg-emerald-500 text-white font-black text-xl rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 active:scale-98 transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🎉 มีคนตอบถูกแล้ว!
        </button>
      </div>

      <hr className="border-gray-100 my-4" />

      {/* 👑 แผงควบคุมลับสำหรับ HOST เท่านั้น */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">🛠️ แผงควบคุมสำหรับ HOST</h3>
        
        {isEditing ? (
          /* 📝 ฟอร์มตอนกดปุ่มแก้ไขคำศัพท์ */
          <form onSubmit={handleSaveEdit} className="space-y-2">
            <input
              type="text"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              className="w-full px-3 py-2 border border-amber-400 bg-white rounded-lg focus:outline-none font-bold text-slate-800"
              placeholder="พิมพ์คำแก้ที่นี่..."
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-md hover:bg-amber-600 transition"
              >
                บันทึกคำใหม่
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-bold rounded-md hover:bg-gray-300 transition"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        ) : (
          /* 👁️ ปุ่มแอบดูคำศัพท์ และปุ่มกดเข้าสู่โหมดแก้ไขคำ */
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 bg-white p-2.5 border border-slate-200 rounded-lg">
              <div className="overflow-hidden">
                <span className="text-xs text-gray-400 block">คำปริศนาตอนนี้</span>
                <span className="font-black text-slate-800 text-base block truncate">
                  {showWord ? word : '••••••••'}
                </span>
              </div>
              <button
                type="button"
                onMouseDown={() => setShowWord(true)}
                onMouseUp={() => setShowWord(false)}
                onMouseLeave={() => setShowWord(false)}
                onTouchStart={() => setShowWord(true)}
                onTouchEnd={() => setShowWord(false)}
                className="px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-md hover:bg-slate-900 transition flex items-center gap-1 shrink-0 select-none"
              >
                👁️ กดค้างเพื่อดู
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenEdit}
              className="w-full py-2 bg-white border border-dashed border-slate-300 text-slate-600 text-xs font-bold rounded-lg hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition flex items-center justify-center gap-1"
            >
              ✏️ แก้ไขคำศัพท์ (หยุดเวลาชั่วคราว)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};