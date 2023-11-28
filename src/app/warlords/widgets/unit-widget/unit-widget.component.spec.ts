import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UnitWidgetComponent} from './unit-widget.component';

describe('UnitWidgetComponent', () => {
  let component: UnitWidgetComponent;
  let fixture: ComponentFixture<UnitWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitWidgetComponent]
    });
    fixture = TestBed.createComponent(UnitWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
