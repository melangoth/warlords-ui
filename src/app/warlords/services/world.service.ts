import {Injectable} from '@angular/core';
import {Coords, RecruitEvent, World} from '../model/warlords.model';
import {first, forkJoin, mergeMap, Observable, ReplaySubject, tap} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {CommandSixGame, CommandSixRecruitAction, CommandSixTurn, CommandSixUnit} from "../model/commandsix.model";

@Injectable({providedIn: 'root'})
export class WorldService {
  private readonly fieldRadius = 3;
  private readonly baseUrl = 'http://localhost:8080';
  private readonly baseCoords = new Coords(0, 0);

  private currentWorld: World;
  private game: CommandSixGame;

  constructor(private http: HttpClient) {

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
        mergeMap(() => this.http.get<CommandSixUnit[]>(`${this.baseUrl}/api/v1/units/byOwner/${this.currentWorld.playerId}`).pipe(first())),
        tap(units => console.log('Units found:', units)),
        tap((units: CommandSixUnit[]) => {
          const tiles = this.currentWorld.tilesMap;
          units.forEach(unit => {
            const tile = tiles.get(unit.coords);
            if (tile) {
              tile.addUnits([unit]);
              console.log('Unit added to tile:', tile, unit);
            }
          });
        }),
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
      this.generateCoords(this.fieldRadius)
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

  recruitUnits(recruitEvents: RecruitEvent[]) {
    const recruitActions = recruitEvents.map(recruit => {
      const action: CommandSixRecruitAction = {
        gameId: this.game.id,
        playerId: this.currentWorld.playerId,
        turnNumber: this.currentWorld.turnNumber,
        quantity: recruit.quantity,
        unitType: recruit.unitType,
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
