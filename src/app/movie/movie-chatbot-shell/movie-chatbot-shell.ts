import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieStore } from '../../services/movie-store';
import { ActivatedRoute } from '@angular/router';
import { MoviePaginationComponent } from '../movie-pagination/movie-pagination.component';

@Component({
    selector: 'movie-chatbot-shell',
    standalone: true,
    template: `
    <div id="chatbotwrapper"
        class="toggled">
        <div id="chatbar-chatbotwrapper">
            <div class="chatbot-ui" style="padding: 10px; position: absolute; bottom: 0; width: 100%;">
                <textarea id="chatbot-input" placeholder="Type your message here..."
                          style="width: calc(100% - 20px); margin-bottom: 10px; height: 100px;"
                          (keyup.enter)="sendChatMessage()" (keydown.enter)="$event.preventDefault()"></textarea>
                <button id="chatbot-send-btn" style="width: 100%;" (click)="sendMessage()">Send</button>
            </div>
        </div>
        <div id="page-content-chatbotwrapper">
            <div class="container-fluid">
                @if (chatingHasStarted) {
                  @if (movies() && movies().length > 0) {
                        <movie-list [movies]="movies()" />
                        <movie-pagination [currentPage]="currentPage" (changePage)="onPageChange($event)"/>
                    } @else {
                        <div>Hm... no movies were able to be found!</div>
                    }
                }

                @if(loading()) {
                    <div class="spinner"></div>
                }
            </div>
        </div>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MovieListComponent, MoviePaginationComponent],
    styleUrls: ['./movie-chatbot-shell.component.scss'],
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
    }

    public sendChatMessage(): void {
        console.log('Chat message sent');
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
}