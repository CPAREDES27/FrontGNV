import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendienteFormularioComponent } from './pendiente-formulario.component';

describe('PendienteFormularioComponent', () => {
  let component: PendienteFormularioComponent;
  let fixture: ComponentFixture<PendienteFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendienteFormularioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendienteFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
