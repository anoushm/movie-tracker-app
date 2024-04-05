import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [MovieCardComponent],
  template: `
    <div class="card-grid">
      @for (movie of movies(); track movie.id) {
        <movie-card [movie]="movie" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {
  public movies = input<TmdbMovieModel[]>([]);
}
