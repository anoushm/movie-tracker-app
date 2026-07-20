import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { MovieStore } from '../../services/movie-store';

@Component({
    selector: 'movie-search',
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="relative w-full mb-5">
      <input class="search-input" [formControl]="searchInput" placeholder="Search movies..." />
      <i class="fas fa-search search-icon"></i>
    </div>
  `,
})
export class MovieSearchComponent implements OnInit {
  private store = inject(MovieStore);
  public searchInput = new FormControl();

  public ngOnInit(): void {
    this.searchInput.valueChanges.subscribe(q => { this.store.searchMovies(q); });
  }
}
