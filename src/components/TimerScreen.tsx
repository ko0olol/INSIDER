import React, { useState, useEffect } from 'react';

interface TimerScreenProps {
  gameTimeMinutes: number;
  onStopGame: (timeUsedSeconds: number) => void;
}

export const TimerScreen: React.FC<TimerScreenProps> = ({ gameTimeMinutes, onStopGame }) => {
  const totalSeconds = gameTimeMinutes * 60; // แปลงนาทีให้เป็นวินาที
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(true);

  const timeUsed = totalSeconds - timeLeft;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } 
    
    // ✨ เพิ่มจุดจับเวลาหมด: ถ้าเวลาลดลงจนเหลือ 0 ให้สั่งหยุดและตัดเข้าหน้าโหวตอัจฉริยะทันที
    if (timeLeft === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
      onStopGame(timeUsed); // ดีดหน้าจอข้ามไปหน้า VOTING อัตโนมัติ
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onStopGame, timeUsed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
        ช่วงเวลาอภิปรายและสอบถาม
      </span>
      
      <div className="my-8">
        <h1 className="text-7xl font-black font-mono tracking-tight text-slate-800">
          {formatTime(timeLeft)}
        </h1>
        <p className="text-sm text-gray-400 mt-2">ทุกคนสามารถรุมถามคำถามกับ Host ได้ทันที</p>
      </div>

      <div className="space-y-3">
        {/* 🎉 ปุ่มนี้ยังคงไว้: สำหรับกรณีที่มีคนทายคำปริศนาถูกก่อนเวลาจะหมดลง */}
        <button
          onClick={() => onStopGame(timeUsed)}
          className="w-full py-4 bg-emerald-500 text-white font-black text-xl rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 active:scale-98 transition flex justify-center items-center gap-2"
        >
          🎉 มีคนตอบถูกแล้ว!
        </button>
        
        {/* 🛑 เอาปุ่มหมดเวลาเดิมออกเรียบร้อยแล้ว ระบบจะจัดการดีดตัวเองอัตโนมัติ */}
      </div>
    </div>
  );
};