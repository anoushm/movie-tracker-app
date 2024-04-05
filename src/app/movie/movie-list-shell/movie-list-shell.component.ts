import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { ActivatedRoute } from '@angular/router';
import { MovieListComponent } from "../movie-list/movie-list.component";

@Component({
  selector: 'movie-list-shell',
  standalone: true,
  template: `
    @if (movies()) {
      <movie-list [movies]="movies()" />
      <div class="pagination">
        <button [disabled]="currentPage === 1"
                (click)="onPageChange(currentPage - 1)">Previous</button>
        <span>Page {{currentPage}}</span>
        <button (click)="onPageChange(currentPage + 1)">Next</button>
      </div>
    } @else {
    <div>Oops, no movies were found!</div>
    }
  `,
  imports: [MovieListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListShellComponent {
  public currentPage: number = 1;
  public pageSize: number = 20;
  public movies = signal<TmdbMovieModel[]>([]);

  constructor(private movieService: MovieService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.loadMovies(this.currentPage);
    });
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
        this.movieService.getMovieList(params['category'], page)
          .subscribe(movies => {
            this.movies.set(movies);
          });
      } else {
        this.movieService.getMoviesByGenre(params['id'], page)
          .subscribe(movies => {
            this.movies.set(movies);
          });
      }
    });
  }
}
