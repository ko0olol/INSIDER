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

  const nonHostPlayers = players.filter((p) => p.id !== host?.id);

  const initGameSession = (currentPlayers: Player[]) => {
    // 1. สุ่มหา Host
    const randomHostIndex = Math.floor(Math.random() * currentPlayers.length);
    const selectedHost = currentPlayers[randomHostIndex];
    setHost(selectedHost);

    // 2. สุ่มหา Insider จากกลุ่มคนที่เหลือที่ไม่ใช่ Host
    const activePool = currentPlayers.filter((p) => p.id !== selectedHost.id);
    const randomInsiderIndex = Math.floor(Math.random() * activePool.length);
    const selectedInsider = activePool[randomInsiderIndex];

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
    initGameSession(players);
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

  const handlePlayAgain = () => {
    setWord('');
    setTimeUsedSeconds(0);
    setVotedPlayerId('');
    initGameSession(players);
  };

  const handleResetAll = () => {
    setPhase('SETUP');
    setHost(null);
    setWord('');
    setPlayerRoles({});
    setTimeUsedSeconds(0);
    setVotedPlayerId('');
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
        <TimerScreen gameTimeMinutes={gameTimeMinutes} onStopGame={handleStopGame} />
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