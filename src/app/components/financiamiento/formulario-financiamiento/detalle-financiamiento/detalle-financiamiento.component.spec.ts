import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFinanciamientoComponent } from './detalle-financiamiento.component';

describe('DetalleFinanciamientoComponent', () => {
  let component: DetalleFinanciamientoComponent;
  let fixture: ComponentFixture<DetalleFinanciamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleFinanciamientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleFinanciamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
