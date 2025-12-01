import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { ActivatedRoute } from '@angular/router';
import { MovieListComponent } from "../movie-list/movie-list.component";
import { MovieSearchComponent } from "../movie-search/movie-search.component";
import { MovieStore } from '../../services/movie-store';
import { MoviePaginationComponent } from '../movie-pagination/movie-pagination.component';

@Component({
    selector: 'movie-list-shell',
    template: `
    <movie-search></movie-search>
    @if(error()) {
      <div class="error-message">{{ error() }}</div>
    } @else if(loading()) {
      <div class="spinner"></div>
    } @else if (movies()) {
      <movie-list [movies]="movies()" />
      @if(movies().length > 10) {
        <movie-pagination [currentPage]="currentPage" (changePage)="onPageChange($event)"/>
      }
    } @else {
      <div>Oops, no movies were found!</div>
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MovieListComponent, MovieSearchComponent, MoviePaginationComponent],
    providers: [MovieStore],
    styles: [`
    .prev-next-buttons {
      @apply bg-gray-100 h-full rounded-lg overflow-hidden shadow-md;
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: #B08500; // Darker yellow background
      color: white; // White text color
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; // iOS font

      &:hover {
        box-shadow: 0 0 30px 10px rgba(176, 133, 0, 0.7); // Darker yellow glow on hover
        transform: scale(1.02);
        transition: transform 0.3s ease-in-out;
      }
    }

    .page-number {
      @apply bg-gray-100 h-full rounded-lg overflow-hidden shadow-md;
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: transparent; // Transparent background
      color: white; // White text color
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; // iOS font
    }
  `]
})
export class MovieListShellComponent implements OnInit {
  private store = inject(MovieStore);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public currentPage: number = 1;
  public pageSize: number = 20;
  public movies: Signal<TmdbMovieModel[]> = this.store.movies;
  public loading = this.store.loadingMovies;
  public error = this.store.errorMovies;

  public ngOnInit(): void {
    this.loadMovies(this.currentPage);
  }

  public onPageChange(page: number): void {
    this.currentPage = page;

    this.activatedRoute.params.subscribe(params => {
      this.loadMovies(this.currentPage);
    });
  }

  private loadMovies(page: number): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['category']) {
        this.store.loadMovies(params['category'], page);
      } else {
        this.store.loadMoviesByGenre(params['id'], page);
      }
    });
  }
}
