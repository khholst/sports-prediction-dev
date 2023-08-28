import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSpecialResultComponent } from './new-special-result.component';

describe('NewSpecialResultComponent', () => {
  let component: NewSpecialResultComponent;
  let fixture: ComponentFixture<NewSpecialResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSpecialResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSpecialResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
