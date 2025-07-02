import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

@Component({
  selector: 'app-quotes-carousel',
  imports: [CommonModule],
  templateUrl: './quotes-carousel.html',
  styleUrl: './quotes-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuotesCarousel {
  quotes: any[] = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Success"
    },
    {
      text: "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon",
      category: "Life"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "Dreams"
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
      category: "Inspiration"
    },
    {
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins",
      category: "Motivation"
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
      category: "Opportunity"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      category: "Courage"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      category: "Action"
    }
  ];

   currentSlide = 0;
  private autoSlideInterval: ReturnType<typeof setInterval> | null = null;
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 8000); // You can adjust timing
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.quotes.length;
    this.cdr.detectChanges(); // ✅ required in zoneless
  }


}
