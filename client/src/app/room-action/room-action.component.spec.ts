import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomActionComponent } from './room-action.component';

describe('RoomActionComponent', () => {
  let component: RoomActionComponent;
  let fixture: ComponentFixture<RoomActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
