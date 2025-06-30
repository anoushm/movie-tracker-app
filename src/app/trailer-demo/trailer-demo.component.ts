import { Component } from '@angular/core';
import { InlineTrailerComponent } from '../movie/inline-trailer/inline-trailer.component';
import { TrailerModel } from '../shared/models/trailer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trailer-demo',
  standalone: true,
  imports: [CommonModule, InlineTrailerComponent],
  template: `
    <div class="demo-container">
      <h2>🎬 Inline Trailer Demo</h2>
      <p>This demonstrates how trailers will appear in the chatbot when users ask about movies with available trailers.</p>
      
      <div class="demo-section">
        <h3>Single Movie Response</h3>
        <div class="mock-message assistant">
          <div class="chat-icon">
            🤖
          </div>
          <div class="message-content">
            <p>Get ready to dive into the dark and gritty world of Gotham with "The Batman"! 
               Directed by Matt Reeves, this film features Robert Pattinson donning the cape and cowl 
               in a fresh perspective on the iconic superhero.</p>
            
            <div class="trailer-section">
              <p class="trailer-intro">
                🎬 Here's the trailer for <strong>The Batman</strong>:
              </p>
              <app-inline-trailer [trailer]="batmanTrailer"></app-inline-trailer>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h3>Multiple Movies Response</h3>
        <div class="mock-message assistant">
          <div class="chat-icon">
            🤖
          </div>
          <div class="message-content">
            <p>Here are some great superhero movies you might enjoy!</p>
            
            <div class="trailer-section">
              <p class="trailer-intro">
                🎬 Here's the trailer for <strong>Spider-Man: No Way Home</strong>:
              </p>
              <app-inline-trailer [trailer]="spidermanTrailer"></app-inline-trailer>
            </div>

            <div class="trailer-section">
              <p class="trailer-intro">
                🎬 Here's the trailer for <strong>Avengers: Endgame</strong>:
              </p>
              <app-inline-trailer [trailer]="avengersTrailer"></app-inline-trailer>
            </div>
          </div>
        </div>
      </div>

      <div class="instructions">
        <h3>How to Use</h3>
        <ul>
          <li>Click on any video to expand it to fullscreen</li>
          <li>In fullscreen mode, click "Close" to return to inline view</li>
          <li>Click "Watch on YouTube" to open the video in a new tab</li>
          <li>Hover over inline videos to see the expand overlay</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .demo-section {
      margin-bottom: 30px;
    }

    .mock-message {
      margin-bottom: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
      background-color: #efa21b;
      color: black;
      display: flex;
      gap: 10px;
    }

    .chat-icon {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .message-content {
      flex: 1;
    }

    .trailer-section {
      margin-top: 12px;
      padding: 8px 0;
    }

    .trailer-intro {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    .instructions {
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
    }

    .instructions h3 {
      margin-top: 0;
      color: #333;
    }

    .instructions ul {
      margin: 10px 0;
      padding-left: 20px;
    }

    .instructions li {
      margin-bottom: 8px;
      color: #666;
    }
  `]
})
export class TrailerDemoComponent {
  batmanTrailer: TrailerModel = {
    key: "vc7_mH2PWHs",
    name: "Official HBO Max Trailer",
    site: "YouTube",
    type: "Trailer",
    official: true,
    youTubeUrl: "https://www.youtube.com/watch?v=vc7_mH2PWHs",
    embedUrl: "https://www.youtube.com/embed/vc7_mH2PWHs",
    thumbnailUrl: "https://img.youtube.com/vi/vc7_mH2PWHs/maxresdefault.jpg"
  };

  spidermanTrailer: TrailerModel = {
    key: "JfVOs4VSpmA",
    name: "Official Trailer",
    site: "YouTube",
    type: "Trailer",
    official: true,
    youTubeUrl: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
    embedUrl: "https://www.youtube.com/embed/JfVOs4VSpmA",
    thumbnailUrl: "https://img.youtube.com/vi/JfVOs4VSpmA/maxresdefault.jpg"
  };

  avengersTrailer: TrailerModel = {
    key: "TcMBFSGVi1c",
    name: "Official Trailer",
    site: "YouTube",
    type: "Trailer",
    official: true,
    youTubeUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    embedUrl: "https://www.youtube.com/embed/TcMBFSGVi1c",
    thumbnailUrl: "https://img.youtube.com/vi/TcMBFSGVi1c/maxresdefault.jpg"
  };
}
