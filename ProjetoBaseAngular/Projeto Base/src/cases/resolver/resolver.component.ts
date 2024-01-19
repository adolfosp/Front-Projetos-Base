import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-resolver',
  templateUrl: 'resolver.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ResolverComponent implements OnInit {
  post$: Observable<string | null> = of(null);

  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.post$ = this.route.data.pipe(map(({ post }) => post));
    console.log(this.post$);
  }
}
