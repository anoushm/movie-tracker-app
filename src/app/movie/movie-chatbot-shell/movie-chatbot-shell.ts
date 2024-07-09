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
        <div id="sidebar-chatbotwrapper">
        </div>
        <div id="page-content-chatbotwrapper">
            <div class="container-fluid">
                @if (movies()) {
                    <movie-list [movies]="movies()" />
                    <movie-pagination [currentPage]="currentPage" (changePage)="onPageChange($event)"/>
                } @else {
                    <div>Oops, no movies were found!</div>
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

    private loadMovies(page: number): void {
        // this.activatedRoute.params.subscribe(params => {
        //     if (params['category']) {
        //         this.store.loadMovies(params['category'], page);
        //     } else {
        //         this.store.loadMoviesByGenre(params['id'], page);
        //     }
        // });
    }
}