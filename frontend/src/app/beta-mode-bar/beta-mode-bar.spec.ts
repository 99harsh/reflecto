import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaModeBar } from './beta-mode-bar';

describe('BetaModeBar', () => {
  let component: BetaModeBar;
  let fixture: ComponentFixture<BetaModeBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetaModeBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetaModeBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
