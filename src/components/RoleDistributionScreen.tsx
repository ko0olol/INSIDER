import React, { useState } from 'react';
import { Player, PlayerRoleMap } from '../types/game';

interface RoleDistributionScreenProps {
  nonHostPlayers: Player[];
  playerRoles: PlayerRoleMap;
  onFinished: () => void;
}

export const RoleDistributionScreen: React.FC<RoleDistributionScreenProps> = ({ nonHostPlayers, playerRoles, onFinished }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRole, setShowRole] = useState(false);

  const currentPlayer = nonHostPlayers[currentIndex];
  const currentRole = playerRoles[currentPlayer?.id];

  const handleNext = () => {
    setShowRole(false);
    if (currentIndex < nonHostPlayers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinished();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl text-center border border-gray-100">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
        การแจกบทบาท ({currentIndex + 1} / {nonHostPlayers.length})
      </span>

      <div className="my-8">
        {!showRole ? (
          <div>
            <p className="text-lg text-gray-600 mb-2">ส่งมือถือต่อให้คุณ</p>
            <h3 className="text-4xl font-extrabold text-indigo-900 mb-8 tracking-tight">{currentPlayer?.name}</h3>
            <button onClick={() => setShowRole(true)} className="w-full py-5 bg-indigo-600 text-white text-xl font-bold rounded-2xl shadow-md hover:bg-indigo-700 active:scale-95 transition">
              ดู Role ของฉัน
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <p className="text-sm text-gray-400 mb-2">บทบาทของคุณ {currentPlayer?.name} คือ</p>
            <div className={`mx-auto my-6 p-6 rounded-2xl max-w-xs border-2 ${
              currentRole === 'INSIDER' ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-4xl font-black tracking-widest ${
                currentRole === 'INSIDER' ? 'text-red-600 animate-bounce' : 'text-slate-700'
              }`}>
                {currentRole}
              </span>
            </div>
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg mb-8">⚠️ ห้ามให้คนอื่นเห็นหน้าจอนี้เด็ดขาด!</p>
            <button onClick={handleNext} className="w-full py-4 bg-gray-800 text-white text-xl font-bold rounded-xl hover:bg-gray-900 active:scale-95 transition">
              {currentIndex < nonHostPlayers.length - 1 ? 'ซ่อน Role และส่งต่อ' : 'ซ่อน Role และดำเนินการต่อ'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};