import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesCarousel } from './quotes-carousel';

describe('QuotesCarousel', () => {
  let component: QuotesCarousel;
  let fixture: ComponentFixture<QuotesCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotesCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotesCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
