import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, input, output } from '@angular/core';

@Component({
    selector: 'movie-pagination',
    standalone: true,
    template: `
    <div class="pagination">
      <button class="prev-next-buttons" [disabled]="currentPage() === 1"
              (click)="changePage.emit(currentPage() - 1)">Previous</button>
      <span class="page-number">Page {{currentPage()}}</span>
      <button class="prev-next-buttons" (click)="changePage.emit(currentPage() + 1)">Next</button>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
    .prev-next-buttons {
      @apply bg-gray-100 h-full rounded-lg overflow-hidden shadow-md;
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: #B08500; // Darker yellow background
      color: white; // White text color
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; // iOS font

      &:hover {
        box-shadow: 0 0 30px 10px rgba(176, 133, 0, 0.7); // Darker yellow glow on hover
        transform: scale(1.02);
        transition: transform 0.3s ease-in-out;
      }
    }

    .page-number {
      @apply bg-gray-100 h-full rounded-lg overflow-hidden shadow-md;
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: transparent; // Transparent background
      color: white; // White text color
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; // iOS font
    }
  `]
})
export class MoviePaginationComponent {
    public currentPage = input<number>(1);
    public changePage = output<number>();
}