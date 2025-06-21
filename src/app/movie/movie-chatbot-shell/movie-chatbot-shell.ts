import { ChangeDetectionStrategy, Component, OnInit, Signal, inject } from '@angular/core';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { TmdbMovieModel } from '../../shared/models/tmdb-movie.model';
import { MovieStore } from '../../services/movie-store';
import { ActivatedRoute } from '@angular/router';
import { MoviePaginationComponent } from '../movie-pagination/movie-pagination.component';
import { MovieChatbotContentComponent } from '../movie-chatbot-content/movie-chatbot-content.component';

const CHEVRON_LEFT_PATH =
  'M396.417 37.911C390.845 31.0529 380.768 30.0104 373.91 35.5827L117.91 243.583C114.171 246.621 111.999 251.182 111.999 256.001C111.999 260.819 114.171 265.38 117.91 268.418L373.91 476.418C380.768 481.991 390.845 480.948 396.417 474.09C401.99 467.232 400.947 457.155 394.089 451.583L153.372 256.001L394.089 60.4183C400.947 54.8461 401.99 44.7692 396.417 37.911Z';
const CHEVRON_RIGHT_PATH =
  'M115.583 37.911C121.155 31.0529 131.232 30.0104 138.09 35.5827L394.09 243.583C397.829 246.621 400.001 251.182 400.001 256.001C400.001 260.819 397.829 265.38 394.09 268.418L138.09 476.418C131.232 481.991 121.155 480.948 115.583 474.09C110.01 467.232 111.053 457.155 117.911 451.583L358.628 256.001L117.911 60.4183C111.053 54.8461 110.01 44.7692 115.583 37.911Z';

@Component({
    selector: 'movie-chatbot-shell',
    template: `
    <div id="chatbotwrapper" class="toggled">
        <div id="chatbar-chatbotwrapper">
            <movie-chatbot-content></movie-chatbot-content>
        </div>
        @if (showMovieList) {
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
        }
        <button id="movie-list-toggle" class="movie-list-toggle md:hidden" (click)="toggleMovieList()">
            <ng-container *ngIf="!showMovieList; else closeList">
                <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" [attr.d]="chevronLeftPath" fill="black"></path>
                </svg>
            </ng-container>
            <ng-template #closeList>
                <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" [attr.d]="chevronRightPath" fill="black"></path>
                </svg>
            </ng-template>
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
    public chevronLeftPath = CHEVRON_LEFT_PATH;
    public chevronRightPath = CHEVRON_RIGHT_PATH;

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
