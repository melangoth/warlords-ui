import {Injectable} from '@angular/core';
import {Coords, Unit, World} from '../model/warlords.model';
import {first, forkJoin, mergeMap, Observable, ReplaySubject, tap} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {CommandSixGame, CommandSixRecruitAction, CommandSixTurn} from "../model/commandsix.model";

@Injectable({providedIn: 'root'})
export class WorldService {
  private readonly fieldRadius = 3;
  private readonly baseUrl = 'http://localhost:8080';
  private readonly baseCoords = new Coords(0, 0);

  private currentWorld: World;
  private game: CommandSixGame;
  private readonly unitTypeMap = new Map<string, string>();

  constructor(private http: HttpClient) {
    this.unitTypeMap.set('I', 'INFANTRY');
    this.unitTypeMap.set('C', 'CAVALRY');
    this.unitTypeMap.set('A', 'ARTILLERY');

    this.http.get<CommandSixGame[]>(`${this.baseUrl}/api/v1/games/list`)
      .pipe(
        first(),
        tap(games => games.forEach(game => console.log('Game found:', game))),
        tap(games => {
          if (games.length) {
            this.game = games[0]
            this.currentWorld = this.createWorld(this.game);
            this.currentWorld.playerId = this.game.playerIds[0];
          }
        }),
        mergeMap(() => this.http.get<CommandSixTurn>(`${this.baseUrl}/api/v1/turns/latest/${this.game?.id}`).pipe(first())),
        tap(turn => console.log('Turn found:', turn)),
        tap(turn => this.currentWorld.turnNumber = turn.turnNumber),
        tap(turn => this.currentWorld.turnStatus = turn.status),
        tap(() => this._world$.next(this.currentWorld))
      )
      .subscribe();
  }

  private _world$ = new ReplaySubject<World>(1);

  get world$(): Observable<World> {
    return this._world$;
  }

  createWorld(game: CommandSixGame): World {
    return new World(
      game.name,
      this.generateCoords(this.fieldRadius),
      [
        new Unit(new Coords(1, -2), 'c', 3),
        new Unit(new Coords(1, -2), 'i', 7),
        new Unit(new Coords(1, -1), 'i', 10),
        new Unit(new Coords(1, -1), 'i', 1)
      ]
    );
  }

  generateCoords(radius: number): Coords[] {
    const coords: Coords[] = [];
    for (let q = radius * -1; q <= radius; q++) {
      for (let r = radius * -1; r <= radius; r++) {
        const s = 0 - q - r;
        if (s >= radius * -1 && s <= radius) {
          coords.push(new Coords(q, r));
        }
      }
    }
    return coords;
  }

  recruitUnits(units: Unit[]) {
    const recruitedUnits = units
      .filter(unit => unit.size > 0)
      .map(unit => new Unit(this.baseCoords, unit.type, unit.size));
    this.currentWorld?.updateRecruits(recruitedUnits);

    const recruitActions = units.map(unit => {
      const action: CommandSixRecruitAction = {
        gameId: this.game.id,
        playerId: this.currentWorld.playerId,
        turnNumber: this.currentWorld.turnNumber,
        quantity: unit.size,
        unitType: this.unitTypeMap.get(unit.type.toUpperCase()) || '',
        destination: this.baseCoords.key

      };
      return action;
    });

    const requests = recruitActions.map(action => {
      return this.http.post<CommandSixRecruitAction>(`${this.baseUrl}/api/v1/actions/recruit`, action).pipe(first())
    });

    forkJoin(requests)
      .pipe(
        tap(responses => responses.forEach(r => console.log('Recruit Action saved:', r)))
      )
      .subscribe();
  }
}
