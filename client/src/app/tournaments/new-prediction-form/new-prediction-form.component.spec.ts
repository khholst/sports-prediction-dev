import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPredictionFormComponent } from './new-prediction-form.component';

describe('NewPredictionFormComponent', () => {
  let component: NewPredictionFormComponent;
  let fixture: ComponentFixture<NewPredictionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPredictionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPredictionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
