export type GamePhase =
  | 'SETUP'
  | 'RANDOM_HOST'
  | 'HOST_WORD'
  | 'ROLE_DISTRIBUTION'
  | 'INSIDER_REVEAL'
  | 'TIMER'
  | 'VOTING'
  | 'RESULTS';

export type Role = 'PLAYER' | 'INSIDER';

export interface Player {
  id: string;
  name: string;
}

export interface PlayerRoleMap {
  [playerId: string]: Role;
}

export interface VoteMap {
  [voterId: string]: string; // voterId -> votedPlayerId
}