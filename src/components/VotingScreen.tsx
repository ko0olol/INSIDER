import React, { useState } from 'react';
import { Player, VoteMap } from '../types/game';

interface VotingScreenProps {
  allPlayers: Player[];
  host: Player | null; // ✨ เพิ่มการรับข้อมูล host เข้ามาเพื่อตัดชื่อออก
  onVoteFinished: (votedPlayerId: string) => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({ allPlayers, host, onVoteFinished }) => {
  // 👥 กรองเอาเฉพาะผู้เล่นทั่วไปที่ไม่ใช่ Host ตั้งแต่เริ่มต้นเกมโหวต
  const nonHostPlayers = allPlayers.filter((p) => p.id !== host?.id);

  const [candidates, setCandidates] = useState<Player[]>(nonHostPlayers); // เปลี่ยนจาก allPlayers เป็น nonHostPlayers
  const [voterIndex, setVoterIndex] = useState(0);
  const [votes, setVotes] = useState<VoteMap>({});
  const [isTieBreak, setIsTieBreak] = useState(false);

  // คนที่มีสิทธิ์โหวตในแต่ละคิว ก็คือเฉพาะผู้เล่นทั่วไปที่ไม่ใช่ Host เท่านั้น
  const currentVoter = nonHostPlayers[voterIndex];
  
  // ตัวเลือกปุ่มกด: กรองไม่ให้ผู้เล่นคนนั้นกดโหวตตัวเองได้
  const availableOptions = candidates.filter((p) => p.id !== currentVoter?.id);

  const handleSelectVote = (targetId: string) => {
    if (!currentVoter) return;
    
    const updatedVotes = { ...votes, [currentVoter.id]: targetId };
    setVotes(updatedVotes);

    // วนคิวโหวตเฉพาะในกลุ่มผู้เล่นที่ไม่ใช่ Host เท่านั้น
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

  // ป้องกันกรณีเผื่อคิวโหวตเกินหรือเอ๋อ
  if (!currentVoter) return null;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-6">
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${isTieBreak ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'}`}>
          {isTieBreak ? 'รอบคะแนนเสมอ (Tie Break)' : 'ช่วงโหวตจับ Insider'}
        </span>
        <h2 className="text-xl text-gray-500 mt-3">คิวการโหวตของคุณ</h2>
        <h1 className="text-3xl font-black text-indigo-900 mt-1">{currentVoter.name}</h1>
        <p className="text-sm text-gray-400 mt-1">กดเลือกคนที่คุณคิดว่าเป็น Insider</p>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {availableOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelectVote(option.id)}
            className="w-full py-4 text-lg font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 active:scale-98 transition text-left px-6 flex justify-between items-center"
          >
            <span>{option.name}</span>
            <span className="text-xs text-gray-400 font-normal">กดเพื่อโหวต</span>
          </button>
        ))}
      </div>
    </div>
  );
};