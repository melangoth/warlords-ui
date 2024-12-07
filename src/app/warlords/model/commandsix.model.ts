export enum UnitType {
  MILITIA = 'MILITIA',
  INFANTRY = 'INFANTRY',
  CAVALRY = 'CAVALRY',
  ARTILLERY = 'ARTILLERY'
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
  unitType: UnitType;
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

export interface CommandSixUnit {
  id: string;
  unitType: UnitType;
  ownerId: string;
  coords: string;
}

