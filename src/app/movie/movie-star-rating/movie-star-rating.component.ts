import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';


const range = 10;
const numStars = 5;
const starsArray: number[] = new Array(numStars).fill(1);

@Component({
  selector: 'movie-star-rating',
  template: `
    <span class="tooltip">
      {{ tooltipText }}
    </span>
    <div class="stars">
      @for(star of stars(); track $index)
        {
          <span
            class="star"
            [ngClass]="{
              'star-full': star === 1,
              'star-half': star === 0,
              'star-empty': star === -1
            }">★</span>
                  }
    </div>
    @if(showRating()) {
      <div class="rating-value">{{ rating() }}</div>
    }
  `,
  styleUrls: [
    './movie-star-rating.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true,
  imports: [NgClass],
})
export class MovieStarRatingComponent {
  private range = range;
  private numStars = numStars;
  private maxRating = 5;

  public stars = signal<number[]>(starsArray);
  public showRating = input<boolean>(false);
  public rating = input<number | undefined>(this.localRating);
  public tooltipText = `0 average rating`;

  constructor() {
    this.setToolTopText(this.rating() ?? 0);
  }

  private set localRating(rating: number | undefined) {
    this.maxRating = rating || 0;

    this.setToolTopText(this.localRating);

    const scaledRating = this.maxRating / (this.range / this.numStars);
    const full = Math.floor(scaledRating);
    const half = scaledRating % 1 > 0.5 ? 1 : 0;
    const empty = this.numStars - full - half;
    this.stars.set(new Array(full)
      .fill(1)
      .concat(new Array(half).fill(0))
      .concat(new Array(empty).fill(-1)));
  }

  private get localRating(): number {
    return this.maxRating;
  }

  private setToolTopText(rating: number) {
    this.tooltipText = `${rating} average rating`;
  }
}
