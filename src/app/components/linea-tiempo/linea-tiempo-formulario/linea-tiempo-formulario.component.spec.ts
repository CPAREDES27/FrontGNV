import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaTiempoFormularioComponent } from './linea-tiempo-formulario.component';

describe('LineaTiempoFormularioComponent', () => {
  let component: LineaTiempoFormularioComponent;
  let fixture: ComponentFixture<LineaTiempoFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineaTiempoFormularioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineaTiempoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
