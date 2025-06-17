import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieStore } from '../../services/movie-store';

@Component({
    selector: 'movie-list',
    imports: [MovieCardComponent],
    template: `
  @if(movies() && movies().length === 0) {
    <div class="no-movies">
      <p>No movies found</p>
    </div>
  } @else {
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      @for (movie of movies(); track movie.id) {
        <movie-card [movie]="movie" (toggleFavorite)="updateFavporitList(movie)"/>
      }
    </div>
  }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {
  private store = inject(MovieStore);
  public movies = input<TmdbMovieModel[]>([]);

  public updateFavporitList(movie: TmdbMovieModel): void {
    console.log('Movie added to favorite list:', movie);
    this.store.updateFavoriteMovies(movie);
  }
}
