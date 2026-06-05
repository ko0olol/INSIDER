import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore
import './index.css';
import { useState } from 'react';
import { GamePhase, Player, PlayerRoleMap } from './types/game';
import { SetupScreen } from './components/SetupScreen';
import { RandomHostScreen } from './components/RandomHostScreen';
import { HostWordScreen } from './components/HostWordScreen';
import { RoleDistributionScreen } from './components/RoleDistributionScreen';
import { InsiderRevealScreen } from './components/InsiderRevealScreen';
import { TimerScreen } from './components/TimerScreen';
import { VotingScreen } from './components/VotingScreen';
import { ResultsScreen } from './components/ResultsScreen';

function App() {
  const [phase, setPhase] = useState<GamePhase>('SETUP');
  const [players, setPlayers] = useState<Player[]>([]);
  const [host, setHost] = useState<Player | null>(null);
  const [word, setWord] = useState('');
  const [gameTimeMinutes, setGameTimeMinutes] = useState<number>(5);
  const [playerRoles, setPlayerRoles] = useState<PlayerRoleMap>({});
  const [timeUsedSeconds, setTimeUsedSeconds] = useState(0);
  const [votedPlayerId, setVotedPlayerId] = useState<string>('');
  const [lastInsiderId, setLastInsiderId] = useState<string>(''); 

  const nonHostPlayers = players.filter((p) => p.id !== host?.id);

  // 👑 ปรับปรุงให้รองรับการส่ง forceHostId เพื่อล็อกตัวโฮสต์ในตาถัดไป
  const initGameSession = (currentPlayers: Player[], forceHostId?: string) => {
    let selectedHost: Player;

    // ตรวจสอบว่ามีโฮสต์ที่สืบทอดมาจากตำแหน่ง Insider ตาที่แล้วไหม
    if (forceHostId) {
      const foundPlayer = currentPlayers.find((p) => p.id === forceHostId);
      if (foundPlayer) {
        selectedHost = foundPlayer;
      } else {
        // กันเหนียว: ถ้าคนนั้นกดออกจากปาร์ตี้ไปในหน้าแรก ให้สุ่มใหม่ทดแทน
        const randomHostIndex = Math.floor(Math.random() * currentPlayers.length);
        selectedHost = currentPlayers[randomHostIndex];
      }
    } else {
      // 🎲 ตาแรกสุด หรือกดกลับหน้าหลัก ให้สุ่มหาตามปกติ
      const randomHostIndex = Math.floor(Math.random() * currentPlayers.length);
      selectedHost = currentPlayers[randomHostIndex];
    }
    setHost(selectedHost);

    // 2. สุ่มหา Insider จากกลุ่มคนที่เหลือที่ไม่ใช่ Host
    const activePool = currentPlayers.filter((p) => p.id !== selectedHost.id);
    const randomInsiderIndex = Math.floor(Math.random() * activePool.length);
    const selectedInsider = activePool[randomInsiderIndex];

    // 💾 บันทึก ID ของ Insider ตานี้ไว้สำหรับใช้เป็นโฮสต์รอบหน้า
    setLastInsiderId(selectedInsider.id);

    // 3. แมป Role ใส่ State
    const roles: PlayerRoleMap = {};
    activePool.forEach((player) => {
      roles[player.id] = player.id === selectedInsider.id ? 'INSIDER' : 'PLAYER';
    });

    setPlayerRoles(roles);
    setPhase('RANDOM_HOST');
  };

  const handleStartGame = () => {
    if (players.length < 4) return;
    initGameSession(players); // เริ่มตาแรก สุ่มโฮสต์ปกติ 100%
  };

  const handleConfirmWord = (selectedWord: string) => {
    setWord(selectedWord);
    setPhase('ROLE_DISTRIBUTION');
  };

  const handleStopGame = (seconds: number) => {
    setTimeUsedSeconds(seconds);
    setPhase('VOTING');
  };

  const handleVoteFinished = (votedId: string) => {
    setVotedPlayerId(votedId);
    setPhase('RESULTS');
  };

  // 🔄 ปุ่มเล่นอีกครั้ง: บังคับส่งดึงตำแหน่ง Insider เก่าขึ้นมาเป็น Host
  const handlePlayAgain = () => {
    setWord('');
    setTimeUsedSeconds(0);
    setVotedPlayerId('');
    initGameSession(players, lastInsiderId); 
  };

  // 🛑 ปุ่มกลับหน้าหลัก: ล้างความจำ Insider เก่าออกให้หมด เพื่อสุ่มนับหนึ่งใหม่
  const handleResetAll = () => {
    setPhase('SETUP');
    setHost(null);
    setWord('');
    setPlayerRoles({});
    setTimeUsedSeconds(0);
    setVotedPlayerId('');
    setLastInsiderId(''); // ล้างสิทธิ์ล็อกโฮสต์
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {phase === 'SETUP' && (
        <SetupScreen players={players} setPlayers={setPlayers} onNext={handleStartGame} gameTimeMinutes={gameTimeMinutes} setGameTimeMinutes={setGameTimeMinutes} />
      )}
      {phase === 'RANDOM_HOST' && (
        <RandomHostScreen host={host} onNext={() => setPhase('HOST_WORD')} />
      )}
      {phase === 'HOST_WORD' && (
        <HostWordScreen host={host} onConfirmWord={handleConfirmWord} />
      )}
      {phase === 'ROLE_DISTRIBUTION' && (
        <RoleDistributionScreen
          nonHostPlayers={nonHostPlayers}
          playerRoles={playerRoles}
          onFinished={() => setPhase('INSIDER_REVEAL')}
        />
      )}
      {phase === 'INSIDER_REVEAL' && (
        <InsiderRevealScreen word={word} onNext={() => setPhase('TIMER')} />
      )}
      {phase === 'TIMER' && (
        <TimerScreen gameTimeMinutes={gameTimeMinutes} onStopGame={handleStopGame} word={word} setWord={setWord} />
      )}
      {phase === 'VOTING' && (
        <VotingScreen allPlayers={players} host={host} onVoteFinished={handleVoteFinished} />
      )}
      {phase === 'RESULTS' && (
        <ResultsScreen
          word={word}
          host={host}
          playerRoles={playerRoles}
          votedPlayerId={votedPlayerId}
          players={players}
          timeUsedSeconds={timeUsedSeconds}
          onPlayAgain={handlePlayAgain}
          onReset={handleResetAll}
        />
      )}
    </div>
  );
}

export default App;

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}