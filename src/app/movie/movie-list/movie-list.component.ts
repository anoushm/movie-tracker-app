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
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      @for (movie of movies(); track movie.id) {
        <movie-card [movie]="movie" (toggleFavorite)="updateFavoriteList(movie)"/>
      }
    </div>
  }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {
  private store = inject(MovieStore);
  public movies = input<TmdbMovieModel[]>([]);

  public updateFavoriteList(movie: TmdbMovieModel): void {
    console.log('Movie added to favorite list:', movie);
    this.store.updateFavoriteMovies(movie);
  }
}
