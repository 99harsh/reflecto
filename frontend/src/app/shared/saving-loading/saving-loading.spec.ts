import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingLoading } from './saving-loading';

describe('SavingLoading', () => {
  let component: SavingLoading;
  let fixture: ComponentFixture<SavingLoading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingLoading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingLoading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
