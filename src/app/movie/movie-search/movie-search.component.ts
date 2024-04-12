import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'movie-search',
  standalone: true,
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
      border: 2px solid #FFDB58;
      background-color: #FFF8DC;
      color: #000;
      font-size: 16px;
      transition: all 0.3s ease;
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
  public searchInput = new FormControl();

  constructor(private movieService: MovieService) { }

  public ngOnInit(): void {
    this.searchInput.valueChanges.subscribe(q => { this.movieService.searchMovies(q); });
  }
}
