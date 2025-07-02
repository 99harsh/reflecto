import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reflection } from './reflection';

describe('Reflection', () => {
  let component: Reflection;
  let fixture: ComponentFixture<Reflection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reflection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reflection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
