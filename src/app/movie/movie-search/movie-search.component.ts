import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MovieStore } from '../../services/movie-store';

@Component({
    selector: 'movie-search',
    imports: [CommonModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="relative w-full mb-5">
      <input class="w-full border-2 border-[#efa21b] rounded-md py-2 pl-3 pr-8 text-black placeholder-gray-500 focus:outline-none focus:border-[#efa21b] focus:ring-2 focus:ring-[#efa21b] shadow-inner" [formControl]="searchInput" placeholder="Search movies..." />
      <i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
    </div>
  `,
    styles: []
})
export class MovieSearchComponent implements OnInit {
  private store = inject(MovieStore);
  public searchInput = new FormControl();

  public ngOnInit(): void {
    this.searchInput.valueChanges.subscribe(q => { this.store.searchMovies(q); });
  }
}
