import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XpContainer } from './xp-container';

describe('XpContainer', () => {
  let component: XpContainer;
  let fixture: ComponentFixture<XpContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XpContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XpContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
