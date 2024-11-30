export interface CommandSixCoords {
  q: number;
  r: number;
}

export interface CommandSixGame {
  id: number;
  name: string;
  playerIds: string[];
}

export interface CommandSixRecruitAction {
  id?: string;
  gameId: number;
  playerId: string;
  turnNumber: number;
  unitType: string;
  quantity: number;
  destination: string;
}

export interface CommandSixTurn {
  id: string;
  gameId: string;
  turnNumber: number;
  status: string;
  playerIds: string[];
}
