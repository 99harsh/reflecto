import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateDetails } from './date-details';

describe('DateDetails', () => {
  let component: DateDetails;
  let fixture: ComponentFixture<DateDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
