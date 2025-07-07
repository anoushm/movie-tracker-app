import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'movie-trailer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="trailer">
      @if(!showPlayer) {
        <div class="thumbnail" (click)="loadVideo()">
          <img [src]="thumbnailUrl" [alt]="title || 'Trailer'" />
          <div class="play-overlay">▶</div>
        </div>
      } @else {
        <iframe
          [src]="embedUrl"
          frameborder="0"
          allowfullscreen
        ></iframe>
      }
    </div>
  `,
  styleUrls: ['./movie-trailer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieTrailerComponent {
  @Input() public url!: string;
  @Input() public title?: string;

  public thumbnailUrl = '';
  public embedUrl!: SafeResourceUrl;
  public showPlayer = false;

  constructor(private sanitizer: DomSanitizer) {}

  public ngOnInit(): void {
    const id = this.extractVideoId(this.url);
    this.thumbnailUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}`
    );
  }

  public loadVideo(): void {
    this.showPlayer = true;
  }

  private extractVideoId(url: string): string {
    const match =
      url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/(.+)/) || [];
    return match[1] || url;
  }
}
