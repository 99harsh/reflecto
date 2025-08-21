import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tnc } from './tnc';

describe('Tnc', () => {
  let component: Tnc;
  let fixture: ComponentFixture<Tnc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tnc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tnc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
