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

                @if(error()) {
                  <div class="error-message">
                    {{
                      error() instanceof Error
                        ? error().message
                        : (typeof error() === 'string'
                            ? error()
                            : 'An unexpected error occurred.')
                    }}
                  </div>
                } @else if(loading()) {
                  <div class="spinner"></div>
                }
            </div>
        </div>
        <div class="chatbot-tab-container">
          <div class="tab-navigation">
            <button
              class="tab-button" [class.active]="isActive('chat')" (click)="selectTab('chat')">
              <div class="tab-icon">
                <img src="./assets/chat-icon.svg" style="width:40px;height:40px;filter: invert(1);">
              </div>
              <span class="tab-label">Chat</span>
            </button>

            <button
              class="tab-button" [class.active]="isActive('movies')" (click)="selectTab('movies')">
              <div class="tab-icon">
                <img src="./assets/movie-icon.png" style="max-width:40px;">
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
    public loading = this.store.loadingMovies;
    public error = this.store.errorMovies;
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
                this.store.loadMovies('genre', page).subscribe();
            } else {
                this.store.loadMoviesByGenre(28, page).subscribe();
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
