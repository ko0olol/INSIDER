import React, { useState } from 'react';
import { Player, VoteMap } from '../types/game';

interface VotingScreenProps {
  allPlayers: Player[];
  host: Player | null;
  onVoteFinished: (votedPlayerId: string) => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({ allPlayers, host, onVoteFinished }) => {
  const nonHostPlayers = allPlayers.filter((p) => p.id !== host?.id);

  const [candidates, setCandidates] = useState<Player[]>(nonHostPlayers);
  const [voterIndex, setVoterIndex] = useState(0);
  const [votes, setVotes] = useState<VoteMap>({});
  const [isTieBreak, setIsTieBreak] = useState(false);

  // 🛡️ State สำหรับเก็บ ID คนที่เราจิ้มเลือกไว้ชั่วคราว (กันมือลั่น)
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');

  const currentVoter = nonHostPlayers[voterIndex];
  const availableOptions = candidates.filter((p) => p.id !== currentVoter?.id);

  // 👆 จิ้มเลือกชั่วคราว (ไฮไลท์สีไว้ก่อน ยังไม่ส่งผลโหวต)
  const handleSelectCandidate = (targetId: string) => {
    setSelectedTargetId(targetId);
  };

  // ✅ ปุ่มกดยืนยันตัวจริง (ส่งผลโหวตและเปลี่ยนคิว)
  const handleConfirmVote = () => {
    if (!currentVoter || !selectedTargetId) return;
    
    const updatedVotes = { ...votes, [currentVoter.id]: selectedTargetId };
    setVotes(updatedVotes);
    setSelectedTargetId(''); // ล้างค่าเตรียมให้คนถัดไปเลือก

    if (voterIndex < nonHostPlayers.length - 1) {
      setVoterIndex(voterIndex + 1);
    } else {
      processVotes(updatedVotes);
    }
  };

  const processVotes = (finalVotes: VoteMap) => {
    const tally: { [id: string]: number } = {};
    candidates.forEach((c) => { tally[c.id] = 0; });

    Object.values(finalVotes).forEach((targetId) => {
      if (tally[targetId] !== undefined) {
        tally[targetId]++;
      }
    });

    const maxVotes = Math.max(...Object.values(tally));
    const winners = candidates.filter((c) => tally[c.id] === maxVotes);

    if (winners.length === 1) {
      onVoteFinished(winners[0].id);
    } else {
      setCandidates(winners);
      setVoterIndex(0);
      setVotes({});
      setIsTieBreak(true);
    }
  };

  if (!currentVoter) return null;

  return (
    <div className="w-full max-w-md mx-auto p-5 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col min-h-[500px]">
      
      {/* 📋 หัวข้อแจ้งสถานะคิวโหวต */}
      <div className="text-center mb-5 shrink-0">
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${isTieBreak ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'}`}>
          {isTieBreak ? 'รอบคะแนนเสมอ (Tie Break)' : 'ช่วงโหวตจับ Insider'}
        </span>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-3">ตาของคุุณในการโหวต</h2>
        <h1 className="text-3xl font-black text-indigo-950 mt-0.5">{currentVoter.name}</h1>
      </div>

      {/* 👥 Layout แบบ Grid 2 คอลัมน์ (ขึ้นบรรทัดใหม่อัตโนมัติ กระชับหน้าจอ) */}
      <div className="flex-1 overflow-y-auto pr-1 mb-5">
        <div className="grid grid-cols-2 gap-3">
          {availableOptions.map((option) => {
            const isSelected = selectedTargetId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectCandidate(option.id)}
                className={`p-4 text-center rounded-xl font-bold border transition-all duration-150 relative active:scale-95 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-300'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <span className="block text-base truncate">{option.name}</span>
                {isSelected && (
                  <span className="absolute top-1 right-2 text-[10px] bg-white text-indigo-600 px-1.5 py-0.2 rounded-md font-black shadow-sm">
                    เลือกอยู่
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🛡️ ปุ่มกดยืนยันโหวตท้ายหน้าจอ (ระบบล็อกกันมือลั่น) */}
      <div className="shrink-0 pt-2 border-t border-gray-100">
        <button
          onClick={handleConfirmVote}
          disabled={!selectedTargetId}
          className={`w-full py-4 text-lg font-black rounded-xl transition-all shadow-md ${
            selectedTargetId
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-100 active:scale-98'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          {selectedTargetId ? '🔒 ยืนยันการส่งผลโหวต' : 'โปรดเลือกผู้เล่นด้านบน...'}
        </button>
      </div>

    </div>
  );
};