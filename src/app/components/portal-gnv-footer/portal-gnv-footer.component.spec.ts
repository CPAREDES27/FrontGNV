import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalGnvFooterComponent } from './portal-gnv-footer.component';

describe('PortalGnvFooterComponent', () => {
  let component: PortalGnvFooterComponent;
  let fixture: ComponentFixture<PortalGnvFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortalGnvFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalGnvFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
