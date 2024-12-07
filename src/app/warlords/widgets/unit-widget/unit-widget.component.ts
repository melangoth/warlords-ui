import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {RecruitEvent, Tile} from '../../model/warlords.model';
import {UnitType} from "../../model/commandsix.model";

@Component({
  selector: 'app-unit-widget',
  templateUrl: './unit-widget.component.html',
  styleUrls: ['./unit-widget.component.scss']
})
export class UnitWidgetComponent implements OnChanges {
  @Input() type: UnitType = UnitType.MILITIA;
  @Input() size: number = 0;
  @Input() tile: Tile | undefined;
  @Input() editable = false;
  @Input() restrictions = '';

  @Output() unitSizeChangedBy = new EventEmitter<RecruitEvent>;
  @Output() unitSizeChanged = new EventEmitter<RecruitEvent>;

  typeName: string = '';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["type"]) {
      this.typeName = UnitType[this.type];
    }

  }

  increaseUnit() {
    this.size++;
    this.unitSizeChangedBy.emit(new RecruitEvent(this.type, 1));
    this.unitSizeChanged.emit(new RecruitEvent(this.type, this.size));
  }

  decreaseUnit() {
    if (this.restrictions.includes('non_negative')) {
      if (this.size) {
        this.size--;
      }
    } else {
      this.size--;
    }

    this.unitSizeChangedBy.emit(new RecruitEvent(this.type, -1));
    this.unitSizeChanged.emit(new RecruitEvent(this.type, this.size));
  }
}
