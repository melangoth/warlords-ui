import {CommandSixUnit, UnitType} from './commandsix.model';

export class World {
  public readonly tileRadius = 70;
  public readonly tileWidth = 2 * this.tileRadius;
  public readonly tileHeight = Math.sqrt(3) * this.tileRadius;

  public tilesMap: Map<string, Tile> = new Map();

  public turnNumber: number = 0;
  public turnStatus: string = 'Unknown';
  public playerId: string;
  public playerName: string;

  constructor(
    public name: string,
    public coords: Coords[]
  ) {
    const fieldLeftOffset = /*fieldRadius * 3 / 4 * TILE_WIDTH*/ 0;
    const fieldTopOffset = /*fieldRadius * 0.5 * TILE_HEIGHT*/ 0;

    this.coords.forEach(coord => {
      this.tilesMap.set(
        coord.key,
        new Tile
        (
          coord,
          fieldLeftOffset + coord.q * 3 / 4 * this.tileWidth,
          fieldTopOffset + coord.r * this.tileHeight + coord.q * 0.5 * this.tileHeight,
        )
      )
    });
  }

  get tiles(): Tile[] {
    return [...this.tilesMap.values()];
  }

  getUnitAt(coords: string | Coords): UnitGroup[] {
    const key = (coords instanceof Coords) ? coords.key : coords;
    const tile = this.tilesMap.get(key);
    return tile ? [...tile.unitGroups.values()] : [];
  }
}

export class Coords {
  constructor(public q: number,
              public r: number
  ) {
  }

  get key(): string {
    return `q${this.q}r${this.r}`;
  }
}

export class Tile extends Coords {
  public state: string;
  public mouseOver = false;
  public selected = false;
  public unitGroups: Map<UnitType, UnitGroup> = new Map();
  public unitsSignature = '';

  constructor(
    public coords: Coords,
    public left: number,
    public top: number
  ) {
    super(coords.q, coords.r);
    this.state = 'normal';
  }

  addUnits(units: CommandSixUnit[]) {
    units.forEach(unit => {
      const unitGroup = this.unitGroups.get(unit.unitType) || new UnitGroup(unit.unitType);
      unitGroup.addUnit(unit);
      this.unitGroups.set(unit.unitType, unitGroup);
    });

    this.unitsSignature = this.getUnitsSignature();
  }

  getUnitsSignature() {
    return [...this.unitGroups.values()]
      .map(unitGroup => unitGroup.getGroupSize() + unitGroup.getUnitType().toString()[0].toLowerCase())
      .join(' ');
  }
}

export class UnitGroup {
  unitType: UnitType;
  quantity: number;
  units: CommandSixUnit[];
  coords: string;

  constructor(unitType: UnitType, coords?: string) {
    this.unitType = unitType;
    this.quantity = 0;
    this.units = [];
    if (coords) {
      this.coords = coords;
    }
  }

  addUnit(unit: CommandSixUnit): boolean {
    if (unit.unitType === this.unitType) {
      this.units.push(unit);
      this.quantity = this.units.length;
      return true;
    }
    return false;
  }

  removeUnit(unit: CommandSixUnit) {
    this.units = this.units.filter(u => u.id !== unit.id);
    this.quantity = this.units.length;
  }

  getAllUnits(): CommandSixUnit[] {
    return this.units;
  }

  getGroupSize(): number {
    return this.quantity;
  }

  getUnitType(): UnitType {
    return this.unitType;
  }
}

export class Player {
  constructor(public name: string, public color: string) {
  }
}

export class RecruitEvent {
  constructor(public unitType: UnitType, public quantity: number, public coords: Coords = new Coords(0, 0)) {
  }
}

export class MovementEvent {
  constructor(public origin: Coords, public destination: Coords, units: CommandSixUnit[]) {
  }
}
