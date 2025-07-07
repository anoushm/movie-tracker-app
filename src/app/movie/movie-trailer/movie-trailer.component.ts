import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'movie-trailer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="trailer">
      <h3 class="trailer-title">{{ title || 'Movie Trailer' }}</h3>
      <iframe
        [src]="embedUrl"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  `,
  styleUrls: ['./movie-trailer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieTrailerComponent {
  @Input() public url!: string;
  @Input() public title?: string;

  public embedUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  public ngOnInit(): void {
    const id = this.extractVideoId(this.url);

    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}`
    );
  }

  private extractVideoId(url: string): string {
    const match =
      url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/(.+)/) || [];
    return match[1] || url;
  }
}
