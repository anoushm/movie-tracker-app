import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieStore } from '../../services/movie-store';
import { ActivatedRoute } from '@angular/router';
import { MoviePaginationComponent } from '../movie-pagination/movie-pagination.component';
import { MovieChatbotContentComponent } from '../movie-chatbot-content/movie-chatbot-content.component';

const LIST_ICON_PATH =
  'M4 6h16v2H4V6z M4 11h16v2H4v-2z M4 16h16v2H4v-2z';
const CHAT_ICON_PATH =
  'M2 2h20v14H6l-4 4V2z';

@Component({
    selector: 'movie-chatbot-shell',
    template: `
    <div id="chatbotwrapper" class="toggled" [class.list-open]="showMovieList">
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
        <button id="movie-list-toggle" class="movie-list-toggle md:hidden" (click)="toggleMovieList()">
            @if (!showMovieList) {
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path [attr.d]="listIconPath" fill="black"></path>
                </svg>
            } @else {
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path [attr.d]="chatIconPath" fill="black"></path>
                </svg>
            }
        </button>
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
    public showMovieList: boolean = window.innerWidth >= 768;
    public listIconPath = LIST_ICON_PATH;
    public chatIconPath = CHAT_ICON_PATH;

    public ngOnInit(): void {
        this.loadMovies(this.currentPage);
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

    public toggleMovieList(): void {
        this.showMovieList = !this.showMovieList;
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
