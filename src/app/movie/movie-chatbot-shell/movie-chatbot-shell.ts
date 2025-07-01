import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieStore } from '../../services/movie-store';
import { ActivatedRoute } from '@angular/router';
import { MoviePaginationComponent } from '../movie-pagination/movie-pagination.component';
import { MovieChatbotContentComponent } from '../movie-chatbot-content/movie-chatbot-content.component';

@Component({
    selector: 'movie-chatbot-shell',
    template: `
    <div id="chatbotwrapper"
        class="toggled">
        <div id="chatbar-chatbotwrapper">
            <movie-chatbot-content></movie-chatbot-content>
        </div>
        <div id="page-content-chatbotwrapper">
            <div class="container-fluid">
                @if (chatingHasStarted) {
                  @if (movies() && movies().length > 0) {
                        <movie-list [movies]="movies()" />
                        @if(movies().length > 10) {
                          <movie-pagination [currentPage]="currentPage" (changePage)="onPageChange($event)"/>
                        }
                    } @else {
                        <div>Hm... no movies were able to be found!</div>
                    }
                }

                @if(loading()) {
                    <div class="spinner"></div>
                }
            </div>
        </div>
        <div class="chatbot-tab-container">
          <div class="tab-navigation">
            <button
              class="tab-button" [class.active]="isActive('chat')" (click)="selectTab('chat')">
              <div class="tab-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </div>
              <span class="tab-label">Chat</span>
            </button>

            <button
              class="tab-button" [class.active]="isActive('movies')" (click)="selectTab('movies')">
              <div class="tab-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                </svg>
              </div>
              <span class="tab-label">Movies</span>
            </button>
          </div>
        </div>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MovieListComponent, MoviePaginationComponent, MovieChatbotContentComponent],
    styleUrls: ['./movie-chatbot-shell.component.scss']
})
export class MovieChatbotShellComponent implements OnInit {
    private store = inject(MovieStore);
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    public currentPage: number = 1;
    public pageSize: number = 20;
    public movies: Signal<TmdbMovieModel[]> = this.store.movies;
    public loading = this.store.loading;
    public chatingHasStarted = false;

    public ngOnInit(): void {
        this.loadMovies(this.currentPage);
        const wrapper = document.getElementById('wrapper');
        if (wrapper) {
          wrapper.classList.add('chat-active');
        }
    }

    public onPageChange(page: number): void {
        this.currentPage = page;

        this.activatedRoute.params.subscribe(params => {
            this.loadMovies(this.currentPage);
        });
    }

    public toggleMenu(event: MouseEvent): void {
        event.preventDefault();
        const wrapper = document.getElementById('wrapper');

        if (wrapper) {
            wrapper.classList.toggle('toggled');
        }
    }

    private loadMovies(page: number): void {
        this.activatedRoute.params.subscribe(params => {
            if (params['category']) {
                this.store.loadMovies('genre', page);
            } else {
                this.store.loadMoviesByGenre(28, page);
            }

            this.chatingHasStarted = true;
        });
    }

    activeTab: string = 'chat';

    selectTab(tab: string) {
      this.activeTab = tab;

      const wrapper = document.getElementById('wrapper');

      if (wrapper) {
        if (tab === 'chat') {
          wrapper.classList.add('chat-active');
        } else {
          wrapper.classList.remove('chat-active');
        }
      }
    }

    isActive(tab: string): boolean {
      return this.activeTab === tab;
    }

}
