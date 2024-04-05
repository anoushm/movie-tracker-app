import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { AsyncPipe } from '@angular/common';
import { TmdbMovieGenreModel } from '../shared/models/tmdb-movie-genre.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [AsyncPipe,
    RouterLink,
    RouterLinkActive,],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {
  public genres: Signal<TmdbMovieGenreModel[]> = toSignal(this.movieService.getGenres(), { initialValue: [] });

  constructor(private movieService: MovieService) { }

  public toggleMenu(event: Event): void {
    event.preventDefault();
    const wrapper = document.getElementById('wrapper');

    if (wrapper) {
      wrapper.classList.toggle('toggled');
    }
  }
}
