import {Injectable} from '@angular/core';
import {Coords, Unit, World} from '../model/warlords.model';
import {Observable, of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class WorldService {
  public readonly fieldRadius = 3;
  public _baseCoords = new Coords(0, 0, 0);
  private currentWorld: World | undefined;

  get world$(): Observable<World> {
    const coords: Coords[] = [];
    for (let q = this.fieldRadius * -1; q <= this.fieldRadius; q++) {
      for (let r = this.fieldRadius * -1; r <= this.fieldRadius; r++) {
        const s = 0 - q - r;
        if (s >= this.fieldRadius * -1 && s <= this.fieldRadius) {
          coords.push(new Coords(q, r, s));
        }
      }
    }

    this.currentWorld = new World(
        'Dummy World',
        coords,
        [
          new Unit(new Coords(1, -2, 1), 'c', 3),
          new Unit(new Coords(1, -2, 1), 'i', 7),
          new Unit(new Coords(1, -1, 0), 'i', 10),
          new Unit(new Coords(1, -1, 0), 'i', 1)
        ]
    );

    return of(this.currentWorld);
  }

  recruitUnits(units: Unit[]) {
    const recruitedUnits = units.map(unit => new Unit(this._baseCoords, unit.type, unit.size));
    this.currentWorld?.updateRecruits(recruitedUnits);
  }
}
