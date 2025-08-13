import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  encapsulation: ViewEncapsulation.None
})
export class Landing implements OnInit {
  dateParam = signal<string>("");

  route = inject(ActivatedRoute);

  ngOnInit(): void {
      this.dateParam.set(this.route.snapshot.paramMap.get("date") || "");
  }

}
