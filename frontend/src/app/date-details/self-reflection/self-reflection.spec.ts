import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfReflection } from './self-reflection';

describe('SelfReflection', () => {
  let component: SelfReflection;
  let fixture: ComponentFixture<SelfReflection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfReflection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfReflection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
