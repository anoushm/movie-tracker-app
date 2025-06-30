import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrailerModel } from '../../shared/models/trailer.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-inline-trailer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="trailer-container" *ngIf="trailer">
      <div class="trailer-header">
        <h4 class="trailer-title">{{ trailer.name }}</h4>
        <span class="trailer-type">{{ trailer.type }}</span>
      </div>
      
      <div class="video-wrapper" (click)="toggleFullscreen()">
        <iframe 
          *ngIf="!showFullscreen()"
          [src]="getEmbedUrl()"
          class="trailer-video-small"
          frameborder="0"
          allowfullscreen>
        </iframe>
        
        <iframe 
          *ngIf="showFullscreen()"
          [src]="getEmbedUrl()"
          class="trailer-video-fullscreen"
          frameborder="0"
          allowfullscreen>
        </iframe>
        
        <div class="video-overlay" *ngIf="!showFullscreen()">
          <div class="expand-icon">⛶</div>
          <span class="expand-text">Click to expand</span>
        </div>
      </div>
      
      <div class="trailer-actions" *ngIf="showFullscreen()">
        <button (click)="toggleFullscreen()" class="close-button">✕ Close</button>
        <a [href]="trailer.youTubeUrl" target="_blank" class="youtube-link">
          🎬 Watch on YouTube
        </a>
      </div>
    </div>
  `,
  styles: [`
    .trailer-container {
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      background: #f9f9f9;
      max-width: 100%;
    }

    .trailer-header {
      padding: 8px 12px;
      background: #efa21b;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .trailer-title {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .trailer-type {
      font-size: 12px;
      background: rgba(255,255,255,0.2);
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 8px;
    }

    .video-wrapper {
      position: relative;
      cursor: pointer;
      width: 100%;
    }

    .trailer-video-small {
      width: 100%;
      height: 180px;
      display: block;
      border: none;
    }

    .trailer-video-fullscreen {
      width: 100%;
      height: 400px;
      display: block;
      border: none;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .video-wrapper:hover .video-overlay {
      opacity: 1;
    }

    .expand-icon {
      font-size: 28px;
      margin-bottom: 4px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    }

    .expand-text {
      font-size: 13px;
      font-weight: 500;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    }

    .trailer-actions {
      padding: 8px 12px;
      background: #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .close-button {
      background: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s ease;
    }

    .close-button:hover {
      background: #c82333;
    }

    .youtube-link {
      color: #efa21b;
      text-decoration: none;
      font-size: 12px;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .youtube-link:hover {
      color: #d89419;
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .trailer-video-small {
        height: 160px;
      }
      
      .trailer-video-fullscreen {
        height: 280px;
      }
      
      .trailer-title {
        font-size: 13px;
      }
      
      .expand-icon {
        font-size: 24px;
      }
      
      .expand-text {
        font-size: 12px;
      }
    }
  `]
})
export class InlineTrailerComponent {
  @Input() trailer: TrailerModel | null = null;
  
  protected showFullscreen = signal(false);

  constructor(private sanitizer: DomSanitizer) {}

  getEmbedUrl(): SafeResourceUrl {
    if (!this.trailer?.embedUrl) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.trailer.embedUrl);
  }

  toggleFullscreen(): void {
    this.showFullscreen.set(!this.showFullscreen());
  }
}
