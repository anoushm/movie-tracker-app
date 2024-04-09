import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieImagePipe } from "../../shared/pipes/movie-image.pipe";
import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { MovieStarRatingComponent } from "../movie-star-rating/movie-star-rating.component";

@Component({
  selector: 'movie-card',
  standalone: true,
  template: `
  @if (movie(); as movie) {
    <div class="card">
        <img class="w-full mt-5" [src]="movie?.poster_path | movieImage" [alt]="movie?.title" />
        <h3 class="card-title">{{ movie?.title | uppercase}}</h3>
        <p>Released: {{ movie?.release_date | date:'yyyy-MM-dd' }}</p>
        <div class="card-footer">
          <div class="card-text mt-0 mb-5">Vote Count: {{ movie?.vote_count }}</div>
          <div class="rating-favorite">
          <movie-star-rating></movie-star-rating>
          <button [ngClass]="{'favorite': isFavorite}" (click)="onFavoriteClick(movie)">❤️</button>
        </div>
        </div>
    </div>
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MovieImagePipe, DatePipe, UpperCasePipe, MovieStarRatingComponent, NgClass],
  styles: [`
    .card {
      @apply bg-gray-100 h-full rounded-lg overflow-hidden shadow-md flex flex-col;
      
    &:hover {
      @apply bg-gray-200;
      box-shadow: 0 0 10px 5px rgba(255, 0, 0, 0.5);
      transform: scale(1.02);
      transition: transform 0.3s ease-in-out;
      // box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.2);
      box-shadow: 0 0 30px 10px rgba(218, 165, 32, 0.7);
    }
    .favorite {
    color: red;
    }
    .rating-favorite {
      display: flex;
      align-items: center;
    }
    .card-title {
      @apply text-xl font-semibold pl-4 pt-4;
      word-wrap: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 340px;
    }
    button {
      color: white;
      background: transparent;
      border: none;
      font-size: 2rem;
      margin-left: 5px;
    }
  }`]
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
