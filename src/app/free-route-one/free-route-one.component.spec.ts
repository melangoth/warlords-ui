import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FreeRouteOneComponent} from './free-route-one.component';

describe('FreeRouteOneComponent', () => {
  let component: FreeRouteOneComponent;
  let fixture: ComponentFixture<FreeRouteOneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreeRouteOneComponent]
    });
    fixture = TestBed.createComponent(FreeRouteOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
