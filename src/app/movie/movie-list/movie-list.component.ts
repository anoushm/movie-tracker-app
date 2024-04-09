import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [MovieCardComponent],
  template: `
  @if(movies() && movies().length === 0) {
    <div class="no-movies">
      <p>No movies found</p>
    </div>
  } @else {
    <div class="card-grid">
      @for (movie of movies(); track movie.id) {
        <movie-card [movie]="movie" (toggleFavorite)="addToFavporitList(movie)"/>
      }
    </div>
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {
  public movies = input<TmdbMovieModel[]>([]);
  private movieService: MovieService = inject(MovieService);

  public addToFavporitList(movie: TmdbMovieModel): void {
    console.log('Movie added to favorite list:', movie);
    this.movieService.addToFavoriteMovies(movie);
  }
}
