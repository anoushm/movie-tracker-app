import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieImagePipe } from "../../shared/pipes/movie-image.pipe";
import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { MovieStarRatingComponent } from "../movie-star-rating/movie-star-rating.component";

@Component({
    selector: 'movie-card',
    template: `
  @if (movie(); as movie) {
    <div class="w-full max-w-sm m-4 shadow-lg hover:shadow-xl transition-shadow rounded-lg bg-[#1A1A1A] hover:bg-gray-700 text-white flex flex-col border-2 border-transparent hover:border-yellow-400">
        <img class="w-full h-64 md:h-80 object-cover rounded-t-lg" [src]="movie?.poster_path | movieImage" [alt]="movie?.title" />
        <div class="flex flex-col p-4">
          <h3 class="text-lg font-semibold truncate mb-2">{{ movie?.title | uppercase }}</h3>
          <p class="text-sm">Released: {{ movie?.release_date | date:'yyyy-MM-dd' }}</p>
          <div class="mt-1 mb-5 text-sm">Vote Count: {{ movie?.vote_count }}</div>
          <div class="flex items-center">
            <movie-star-rating></movie-star-rating>
            <div class="flex-grow text-right">
              <input type="checkbox" id="fav-checkbox-{{movie?.id}}" class="hidden peer" [checked]="movie?.favorite || false" (change)="onFavoriteClick(movie)">
              <label for="fav-checkbox-{{movie?.id}}" class="ml-2 peer-checked:text-red-500"></label>
            </div>
        </div>
        </div>
    </div>
  }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MovieImagePipe, DatePipe, UpperCasePipe, MovieStarRatingComponent, NgClass],
    styles: []
})
export class MovieCardComponent {
  public movie = input<TmdbMovieModel | null>(null);
  public toggleFavorite = output<TmdbMovieModel>();
  public isFavorite = false;


  public onFavoriteClick(movie: TmdbMovieModel): void {
    this.isFavorite = !this.isFavorite;
    this.toggleFavorite.emit(movie);
  }
}
