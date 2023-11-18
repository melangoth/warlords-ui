import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs';
import {Coords, Tile, Unit, World} from '../model/warlords.model';
import {WorldService} from '../services/world.service';
import * as _ from 'lodash';


// https://www.redblobgames.com/grids/hexagons/#coordinates

const UP_LEFT = new Coords(-1, 0, 1);
const UP = new Coords(0, -1, +1);
const UP_RIGHT = new Coords(1, -1, 0);
const DOWN_RIGHT = new Coords(1, 0, -1);
const DOWN = new Coords(0, 1, -1);
const DOWN_LEFT = new Coords(-1, 1, 0);

@Component({
  selector: 'app-map',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit {
  world: World | undefined;
  showCoordinates = false;
  showUnits = true;
  selectedTile: Tile | undefined;

  dragStart = {x: 0, y: 0};
  dragOffset = {x: 0, y: 0};

  recruitRegister = new Map<string, Unit>();

  constructor(private worldService: WorldService) {
    this.recruitRegister.set('i', new Unit(new Coords(0, 0, 0), 'i', 0));
    this.recruitRegister.set('c', new Unit(new Coords(0, 0, 0), 'c', 0));
    this.recruitRegister.set('a', new Unit(new Coords(0, 0, 0), 'a', 0));
  }

  ngOnInit() {
    this.worldService.world$.pipe(first()).subscribe(world => {
      this.world = world;
      const y = (_.maxBy(world.coords, 's')?.s || 0);
      const x = (_.minBy(world.coords, 'q')?.q || 0) * -1;
      this.dragOffset = {x: x * world.tileWidth * 3 / 4, y: y * world.tileHeight};

      const preselectTile = world.tilesMap.get('q1r-2s1');
      if (preselectTile) {
        this.onMouseClick(preselectTile);
      }
    });
  }

  onMouseEnter(tile: Tile) {
    tile.mouseOver = true;
  }

  onMouseLeave(tile: Tile) {
    tile.mouseOver = false;
  }

  onMouseClick(tile: Tile) {
    tile.selected = !tile.selected;

    if (tile.selected) {
      if (this.selectedTile) {
        this.selectedTile.selected = false;
      }
      this.selectedTile = tile;
    } else {
      this.selectedTile = undefined;
    }
  }

  onDrag($event: DragEvent) {
    if ($event.x && $event.y) {
      this.dragOffset = {
        x: $event.x - this.dragStart.x,
        y: $event.y - this.dragStart.y
      };
    }
  }

  onDragStart($event: DragEvent) {
    this.dragStart = {x: $event.x - this.dragOffset.x, y: $event.y - this.dragOffset.y};
  }

  registerRecruits($event: Unit) {
    const register = this.recruitRegister.get($event.type);
    if (register) {
      register.size = ($event.size > 0) ? $event.size : 0;
    }
  }

  applyRecruitment() {
    this.worldService.recruitUnits(
      [...this.recruitRegister.values()]
        .filter(unit => unit.size > 0)
    );
  }
}
