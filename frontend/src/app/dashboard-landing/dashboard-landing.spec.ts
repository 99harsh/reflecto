import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLanding } from './dashboard-landing';

describe('DashboardLanding', () => {
  let component: DashboardLanding;
  let fixture: ComponentFixture<DashboardLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLanding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLanding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
