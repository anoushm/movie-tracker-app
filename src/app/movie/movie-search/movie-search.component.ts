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
    <div class="search-bar">
      <input class="search-input" [formControl]="searchInput" placeholder="Search movies..." />
      <i class="search-icon fas fa-search"></i>
    </div>
  `,
    styles: [`
    .search-bar {
      position: relative;
      width: 100%;
      margin-bottom: 20px;
    }
    .search-input {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      border: 3px solid #efa21b;
      background-color: #fff;
      color: #000;
      font-size: 16px;
      transition: all 0.3s ease;
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.7);
    }
    .search-input:focus {
      border-color: #FFD700;
      box-shadow: 0 0 10px #FFD700;
    }
    .search-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  `]
})
export class MovieSearchComponent implements OnInit {
  private store = inject(MovieStore);
  public searchInput = new FormControl();

  public ngOnInit(): void {
    this.searchInput.valueChanges.subscribe(q => { this.store.searchMovies(q); });
  }
}
