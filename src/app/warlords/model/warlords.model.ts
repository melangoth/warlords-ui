import * as _ from 'lodash';

export class World {
  public readonly tileRadius = 70;
  public readonly tileWidth = 2 * this.tileRadius;
  public readonly tileHeight = Math.sqrt(3) * this.tileRadius;

  public tilesMap: Map<string, Tile> = new Map();
  public unitsMap: Map<string, Unit[]> = new Map();
  public recruitsMap = new Map<string, Unit>();

  constructor(
    public name: string,
    public coords: Coords[],
    private initialUnits: Unit[]
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

    this.initialUnits.forEach(unit => this.addUnits(unit));
  }

  get units(): Unit[] {
    let unitArrays = [...this.unitsMap.values(), ...this.recruitsMap.values()];
    return _.flatten(unitArrays);
  }

  updateRecruits(recruits: Unit[]) {
    this.recruitsMap = new Map<string, Unit>();
    recruits.forEach(recruit => {
      this.recruitsMap.set(recruit.coords.key + recruit.type, recruit);
    });
  }

  get tiles(): Tile[] {
    return [...this.tilesMap.values()];
  }

  addUnits(unit: Unit) {
    let units = this.unitsMap.get(unit.coords.key) || [];
    this.unitsMap.set(unit.coords.key, [...units, unit]);
  }

  getUnitAt(coords: string | Coords): Unit[] | undefined {
    const key = (coords instanceof Coords) ? coords.key : coords;
    const units: Unit[] = [];
    units.push(...this.unitsMap.get(key) || []);
    const recruits = [...this.recruitsMap.values()].filter(unit => unit.coords.key.startsWith(key));
    units.push(...recruits);
    return units;
  }
}

export class Coords {
  constructor(public q: number,
              public r: number,
              public s: number
  ) {
  }

  get key(): string {
    return `q${this.q}r${this.r}s${this.s}`;
  }
}

export class Unit {
  constructor(
    public coords: Coords,
    public type: string,
    public size: number
  ) {
  }
}

export class Tile extends Coords {
  public state: string;
  public mouseOver = false;
  public selected = false;

  constructor(
    public coords: Coords,
    public left: number,
    public top: number
  ) {
    super(coords.q, coords.r, coords.s);
    this.state = 'normal';
  }
}

export class Player {
  constructor(public name: string, public color: string) {
  }
}
