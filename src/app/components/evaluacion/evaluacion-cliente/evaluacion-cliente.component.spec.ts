import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionClienteComponent } from './evaluacion-cliente.component';

describe('EvaluacionClienteComponent', () => {
  let component: EvaluacionClienteComponent;
  let fixture: ComponentFixture<EvaluacionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
