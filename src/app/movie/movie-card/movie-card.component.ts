import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieImagePipe } from "../../shared/pipes/movie-image.pipe";
import { DatePipe, NgClass } from '@angular/common';
import { MovieStarRatingComponent } from "../movie-star-rating/movie-star-rating.component";

const HEART_OUTLINE_PATH =
  'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z';
const HEART_FILLED_PATH =
  'M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z';

@Component({
    selector: 'movie-card',
    template: `
  @if (movie(); as movie) {
    <div class="card-container w-full m-1 shadow-lg hover:shadow-xl transition-shadow rounded-lg bg-[#1A1A1A] text-white flex flex-col border-b-2 border-transparent hover:border-b-[#efa21b]">
        <img class="w-full h-auto rounded-t-lg" [src]="movie?.poster_path | movieImage" [alt]="movie?.title" />
        <div class="flex flex-col p-4 card-content">
          <h3 class="text-lg font-semibold truncate mb-2">{{ movie?.title }}</h3>
          <p class="mb-1 mt-0 text-sm">Released: {{ movie?.release_date | date:'yyyy' }}</p>
          <div class="mb-1 text-sm">Vote Count: {{ movie?.vote_count }}</div>
          <div class="flex items-center">
            <movie-star-rating></movie-star-rating>
            <div class="flex-grow text-right">
              <input
                type="checkbox"
                id="fav-checkbox-{{movie?.id}}"
                class="sr-only peer"
                [checked]="movie?.favorite"
                (change)="onFavoriteClick(movie)"
              />
              <label for="fav-checkbox-{{movie?.id}}" class="cursor-pointer ml-2 select-none">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.5"
                  [ngClass]="{ hidden: movie?.favorite }"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    [attr.d]="outlineHeartPath"
                  />
                </svg>
                <svg
                  class="w-6 h-6 text-[#efa21b]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  [ngClass]="{ hidden: !movie?.favorite }"
                >
                  <path [attr.d]="filledHeartPath" />
                </svg>
              </label>
            </div>
        </div>
        </div>
    </div>
  }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MovieImagePipe, DatePipe, MovieStarRatingComponent, NgClass],
    styles: []
})
export class MovieCardComponent {
  public movie = input<TmdbMovieModel | null>(null);
  public toggleFavorite = output<TmdbMovieModel>();
  public outlineHeartPath = HEART_OUTLINE_PATH;
  public filledHeartPath = HEART_FILLED_PATH;
  public onFavoriteClick(movie: TmdbMovieModel): void {
    movie.favorite = !movie.favorite;
    this.toggleFavorite.emit(movie);
  }
}
