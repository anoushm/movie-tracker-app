import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieImagePipe } from "../../shared/pipes/movie-image.pipe";
import { DatePipe, UpperCasePipe } from '@angular/common';
import { MovieStarRatingComponent } from "../movie-star-rating/movie-star-rating.component";

@Component({
  selector: 'movie-card',
  standalone: true,
  template: `
  @if (movie(); as movie) {
    <div class="card">
      <!-- <div class="w-full mt-5"> -->
        <img class="w-full mt-5" [src]="movie?.poster_path | movieImage" [alt]="movie?.title" />
      <!-- </div> -->

        <h3 class="card-title">{{ movie?.title | uppercase}}</h3>
        <p>Released: {{ movie?.release_date | date:'yyyy-MM-dd' }}</p>

        <div class="card-footer">
          <div class="card-text mt-0 mb-5">Vote Count: {{ movie?.vote_count }}</div>
          <movie-star-rating [rating]="movie?.vote_average" [showRating]="true"></movie-star-rating>
        </div> 
    </div>
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MovieImagePipe, DatePipe, UpperCasePipe, MovieStarRatingComponent]
})
export class MovieCardComponent {
  public movie = input<TmdbMovieModel | null>(null);
}
