import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Coords, Tile, Unit} from '../../model/warlords.model';

@Component({
  selector: 'app-unit-widget',
  templateUrl: './unit-widget.component.html',
  styleUrls: ['./unit-widget.component.scss']
})
export class UnitWidgetComponent implements OnChanges {
  @Input() type: string = 'm';
  @Input() size: number = 0;
  @Input() tile: Tile | undefined;
  @Input() editable = false;
  @Input() restrictions = '';

  @Output() unitSizeChangedBy = new EventEmitter<Unit>;
  @Output() unitSizeChanged = new EventEmitter<Unit>;

  typeName: string = 'Militia';
  typeNames = new Map<string, string>();

  constructor() {
    this.typeNames.set('m', 'Militia');
    this.typeNames.set('i', 'Infantry');
    this.typeNames.set('c', 'Cavalry');
    this.typeNames.set('a', 'Artillery');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.typeName = this.typeNames.get(this.type) || 'Militia';
  }

  increaseUnit() {
    this.size++;
    this.unitSizeChangedBy.emit(new Unit(this.tile?.coords || new Coords(0, 0, 0), this.type, 1));
    this.unitSizeChanged.emit(new Unit(this.tile?.coords || new Coords(0, 0, 0), this.type, this.size));
  }

  decreaseUnit() {
    if (this.restrictions.includes('non_negative')) {
      if (this.size) {
        this.size--;
      }
    } else {
      this.size--;
    }

    this.unitSizeChangedBy.emit(new Unit(this.tile?.coords || new Coords(0, 0, 0), this.type, -1));
    this.unitSizeChanged.emit(new Unit(this.tile?.coords || new Coords(0, 0, 0), this.type, this.size));
  }
}
